# CI/CD Setup Guide — Run4Health

## Overview

Two ways to auto-deploy when you push to GitHub:

| Approach | How it works | Best for |
|----------|-------------|----------|
| **GitHub Actions** (already set up) | GitHub runs the deploy on their servers via SSH | Public repo, GitHub-native |
| **Webhook** (new) | GitHub hits a URL on YOUR server → server deploys itself | Private repo, full control |

---

## ✅ Prerequisites (Server Setup)

Your Linux server needs these installed:

```bash
# 1. Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# 2. PM2 (process manager)
npm install -g pm2

# 3. Git
sudo apt-get install -y git

# 4. PostgreSQL (if using local DB)
sudo apt-get install -y postgresql postgresql-contrib
```

---

## 📁 Server Directory Structure

```
/var/www/r4h/
├── .env              # ← create this with all secrets
├── deploy.sh         # ← already in repo, place this here
├── ecosystem.config.js  # ← PM2 config (see below)
├── (rest of the app pulled from git)
```

### `ecosystem.config.js` — create on server at `/var/www/r4h/ecosystem.config.js`

```js
module.exports = {
  apps: [{
    name: "r4h",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/var/www/r4h",
    env: { NODE_ENV: "production", PORT: 3000 },
    instances: 1,
    exec_mode: "fork",
    max_memory_restart: "1G",
    error_file: "/var/log/r4h/error.log",
    out_file: "/var/log/r4h/out.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
  }]
}
```

---

## 🚀 Option A: GitHub Actions (Already Configured)

Files already in repo:
- `.github/workflows/deploy.yml` — triggers on push to `main`
- `deploy.sh` — SSH's into server and runs the build

### What you need to add in GitHub repo Settings → Secrets and variables → Actions:

| Secret | Value |
|--------|-------|
| `SERVER_HOST` | Your server IP (e.g. `203.0.113.10`) |
| `SERVER_USER` | SSH username (e.g. `ubuntu` or `deploy`) |
| `SERVER_SSH_KEY` | Private SSH key (copy-paste whole key) |
| `SERVER_PORT` | SSH port (default `22`, optional) |

### To generate an SSH key for deployment:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
# Then copy the PRIVATE key content into SERVER_SSH_KEY secret
cat ~/.ssh/github-actions
```

---

## 🔔 Option B: Webhook (New — POST endpoint)

### 1. Add these to your server's `.env` file:

```env
GITHUB_WEBHOOK_SECRET=your-random-secret-here
DEPLOY_SCRIPT_PATH=/var/www/r4h/deploy.sh
DEPLOY_BRANCH=refs/heads/main
```

Generate a strong secret:
```bash
openssl rand -hex 32
```

### 2. Deploy the app once manually so the webhook route is live:

```bash
cd /var/www/r4h
git pull origin main
npm ci --omit=dev
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 start ecosystem.config.js
```

### 3. Add webhook in GitHub (Settings → Webhooks → Add webhook):

| Field | Value |
|-------|-------|
| **Payload URL** | `https://yourdomain.com/api/webhook/deploy` |
| **Content type** | `application/json` |
| **Secret** | Same as `GITHUB_WEBHOOK_SECRET` in `.env` |
| **SSL verification** | Enable (or disable if no HTTPS) |
| **Events** | Select "Just the push event" |
| **Active** | ✅ Checked |

### 4. Test it

Push to `main` — within seconds the server should:
1. Pull latest code
2. Install deps
3. Run migrations
4. Build
5. Reload PM2

Check logs:
```bash
tail -f /var/log/r4h/deploy.log
pm2 logs r4h
```

---

## 🛡️ Security Notes for Webhook

- `GITHUB_WEBHOOK_SECRET` ensures only GitHub can trigger deploys
- Route verifies `x-hub-signature-256` before running anything
- Webhook ignores non-push events and wrong branches
- Deploy runs synchronously (GitHub waits for a response). If your build takes >30s, GitHub may timeout — but the deploy still completes.
- For production, put the webhook behind HTTPS (use nginx/caddy with Let's Encrypt).

---

## 📦 One-Time Server Setup (copy-paste)

```bash
# Run these once on your server

# 1. Create dirs
sudo mkdir -p /var/www/r4h /var/log/r4h
sudo chown -R $USER:$USER /var/www/r4h /var/log/r4h

# 2. Clone the repo
git clone https://github.com/YOUR_USER/r4h.git /var/www/r4h

# 3. Create .env file
cd /var/www/r4h
nano .env
# Paste all your env vars (DATABASE_URL, JWT_SECRET, etc.)

# 4. Create PM2 config (see above)

# 5. Make deploy.sh executable
chmod +x deploy.sh

# 6. First manual deploy
bash deploy.sh
```

---

## 🩺 Troubleshooting

| Symptom | Check |
|---------|-------|
| Actions fails "Host key verification" | Add server to `~/.ssh/known_hosts` on GitHub runner, or set `SSH_KNOWN_HOSTS` secret |
| Webhook returns 401 | `GITHUB_WEBHOOK_SECRET` mismatch between `.env` and GitHub webhook settings |
| Build fails | Check `npm run build` works locally |
| PM2 not starting | `pm2 status`, `pm2 logs r4h` |
| Database errors | Verify `DATABASE_URL` in `.env` and run `npx prisma migrate deploy` manually |
