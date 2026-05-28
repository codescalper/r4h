# R4H — Reach For Health

A full-stack web application built with **Next.js 16**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS v4**. Features an admin panel, member portal, news/blog, programs, gallery, donations, and email notifications.

---

# 🚀 Linux Server Installation Guide (Beginner Friendly)

This guide walks you through installing and running this project on a fresh **Ubuntu 22.04 / 24.04** (or any Debian-based) Linux server — from zero to a live site.

---

## 📋 What You Will Set Up

| Component | Purpose |
|---|---|
| **Node.js 20** | Runs the Next.js application |
| **npm** | Installs JavaScript packages |
| **PostgreSQL 16** | The database |
| **Git** | To clone the project |
| **PM2** *(recommended)* | Keeps the app alive as a background service |
| **Nginx** *(recommended)* | Reverse proxy so users visit port 80 instead of 3000 |

---

## ✅ Step 1 — Update Your Server

Always start with a system update to get the latest security patches.

```bash
sudo apt update && sudo apt upgrade -y
```

---

## ✅ Step 2 — Install Node.js 20

```bash
# Download and run the official NodeSource setup script for Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js (npm is included)
sudo apt install -y nodejs

# Verify — you should see v20.x.x and 10.x.x
node --version
npm --version
```

---

## ✅ Step 3 — Install Git

```bash
sudo apt install -y git

# Verify
git --version
```

---

## ✅ Step 4 — Install PostgreSQL 16

```bash
# Add the official PostgreSQL apt repository
sudo apt install -y curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg

sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail \
  https://www.postgresql.org/media/keys/ACCC4CF8.asc

sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
  https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list'

sudo apt update
sudo apt install -y postgresql-16

# Start PostgreSQL and enable it to auto-start on reboot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Confirm it is running — you should see "active (running)"
sudo systemctl status postgresql
```

---

## ✅ Step 5 — Create the Database and User

Switch to the `postgres` system user and open the PostgreSQL shell:

```bash
sudo -i -u postgres psql
```

Inside the `psql` prompt, run the following SQL commands one by one.
**Replace `your_strong_password` with your own secure password. Write it down — you will need it in Step 8.**

```sql
-- Create a dedicated app user
CREATE USER r4h_user WITH PASSWORD 'your_strong_password';

-- Create the database
CREATE DATABASE r4h_db;

-- Grant the user full access to the database
GRANT ALL PRIVILEGES ON DATABASE r4h_db TO r4h_user;

-- Connect to the new database and grant schema privileges (required for PostgreSQL 15+)
\c r4h_db
GRANT ALL ON SCHEMA public TO r4h_user;

-- Exit the psql shell
\q
```

> **Your DATABASE_URL will be:**
> `postgresql://r4h_user:your_strong_password@localhost:5432/r4h_db`

---

## ✅ Step 6 — Clone the Repository

```bash
# Navigate to where you want the project to live
cd /var/www

# Clone the repo (replace with your actual Git repo URL)
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git r4h

# Take ownership so you can edit files without sudo
sudo chown -R $USER:$USER /var/www/r4h

# Enter the project directory
cd /var/www/r4h
```

---

## ✅ Step 7 — Generate a Secure JWT Secret

You will need this in the next step. Run this command and **copy the output**:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Step 8 — Create the Environment File

The app reads all secrets from a `.env.local` file. This file is **never committed to Git** — you create it manually on every server.

```bash
nano /var/www/r4h/.env.local
```

Paste and fill in every value:

```env
# ─── Database ────────────────────────────────────────────────────────────────
# Replace with the password you chose in Step 5
DATABASE_URL="postgresql://r4h_user:your_strong_password@localhost:5432/r4h_db"

# ─── App URL ─────────────────────────────────────────────────────────────────
# The public-facing URL. No trailing slash.
# Use http://YOUR_SERVER_IP during testing, switch to https://yourdomain.com later
NEXT_PUBLIC_BASE_URL="http://YOUR_SERVER_IP_OR_DOMAIN"

# ─── JWT Secret ──────────────────────────────────────────────────────────────
# Paste the long hex string you generated in Step 7
JWT_SECRET="paste_your_generated_secret_here"

# ─── Email (Gmail SMTP) ───────────────────────────────────────────────────────
# The Gmail address the app sends emails from (registration, password reset, etc.)
EMAIL="your_gmail_address@gmail.com"

# This must be a Gmail APP PASSWORD — NOT your regular Gmail login password.
# How to generate one:
#   1. Go to myaccount.google.com
#   2. Security → 2-Step Verification (enable it first if not enabled)
#   3. Security → App Passwords
#   4. Create an app password and copy the 16-character code
PASSWORD="your_16_char_app_password"
```

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`

---

## ✅ Step 9 — Install Node Dependencies

```bash
cd /var/www/r4h
npm install
```

> This automatically runs `prisma generate` after install (defined in `package.json` → `postinstall`).

---

## ✅ Step 10 — Run Database Migrations

This creates all the tables in your PostgreSQL database.

```bash
npx prisma migrate deploy
```

> **If you get an error like "no migration files found"**, run this instead (safe for a fresh setup):
>
> ```bash
> npx prisma db push
> ```

---

## ✅ Step 11 — Seed the Database (Create Default Admin)

This creates the first admin account so you can log in.

```bash
npx ts-node prisma/seed.ts
```

> **Default admin login credentials:**
> - **Email:** `admin@gmail.com`
> - **Password:** `Admin@123`
> - **Login page:** `http://YOUR_SERVER_IP/admin/login`
>
> ⚠️ Change these credentials immediately after your first login!

---

## ✅ Step 12 — Create Upload Directories

The app stores user-uploaded files locally. These directories must exist and be writable.

```bash
mkdir -p /var/www/r4h/uploads/gallery \
         /var/www/r4h/uploads/misc \
         /var/www/r4h/uploads/news \
         /var/www/r4h/uploads/programs \
         /var/www/r4h/uploads/user_profile \
         /var/www/r4h/uploads/user_reports

chmod -R 755 /var/www/r4h/uploads/
```

---

## ✅ Step 13 — Build the App for Production

```bash
cd /var/www/r4h
npm run build
```

This compiles the Next.js app into an optimised production bundle. It may take 1–3 minutes.

---

## ✅ Step 14 — Test the App

```bash
npm run start
```

Open `http://YOUR_SERVER_IP:3000` in your browser. You should see the site.

Press `Ctrl + C` to stop. Move on to Step 15 to keep it running permanently.

---

## ✅ Step 15 — Keep the App Running with PM2

PM2 is a process manager that restarts the app if it crashes and survives server reboots.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app
pm2 start npm --name "r4h" -- start

# Save the process list
pm2 save

# Configure PM2 to start automatically on boot
# This prints a command — copy it and run it!
pm2 startup
```

After running `pm2 startup`, it will print a command like:

```
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser
```

**Copy that exact command and run it.** Then run `pm2 save` one more time.

**Useful PM2 commands:**

```bash
pm2 status          # See running apps
pm2 logs r4h        # Stream live app logs
pm2 restart r4h     # Restart the app (e.g. after a code update)
pm2 stop r4h        # Stop the app
pm2 delete r4h      # Remove from PM2
```

---

## ✅ Step 16 — Set Up Nginx Reverse Proxy (Recommended)

Nginx forwards traffic from port 80 → port 3000 so users don't need to type `:3000`.

```bash
sudo apt install -y nginx
```

Create a new site config:

```bash
sudo nano /etc/nginx/sites-available/r4h
```

Paste the following. Replace `YOUR_DOMAIN_OR_IP` with your actual domain or server IP:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Increase this if users upload large files
    client_max_body_size 50M;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit, then activate:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/r4h /etc/nginx/sites-enabled/

# Remove the default Nginx page to avoid conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Test config for syntax errors
sudo nginx -t

# Apply the new config
sudo systemctl reload nginx

# Allow HTTP/HTTPS through the firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

Now visit `http://YOUR_DOMAIN_OR_IP` — no port number needed!

---

## 🔄 Deploying Code Updates

When you pull new code and need to redeploy:

```bash
cd /var/www/r4h

# Pull the latest code
git pull

# Install any new packages
npm install

# Apply any new database schema changes
npx prisma migrate deploy

# Rebuild
npm run build

# Restart the app
pm2 restart r4h
```

---

## 🔐 Firewall Quick Reference

```bash
sudo ufw allow OpenSSH       # SSH — always keep this open or you'll be locked out!
sudo ufw allow 'Nginx Full'  # Port 80 (http) and 443 (https)
sudo ufw enable
sudo ufw status
```

> If you are NOT using Nginx and want direct access to port 3000 during testing:
> ```bash
> sudo ufw allow 3000
> ```

---

## 🗂️ Project Structure

```
r4h/
├── app/                  # All pages and API routes (Next.js App Router)
│   ├── api/              # Backend REST API endpoints
│   ├── admin/            # Admin panel (login, dashboard)
│   ├── member/           # Member portal (login, dashboard)
│   ├── news/             # News / blog pages
│   ├── programs/         # Programs pages
│   ├── gallery/          # Gallery page
│   └── donate/           # Donation page
├── components/           # Reusable React components
├── emails/               # HTML email templates (password reset, approval, etc.)
├── lib/                  # Server utilities (auth, database, email helpers)
├── prisma/
│   ├── schema.prisma     # All database model definitions
│   └── seed.ts           # Creates the default admin account
├── public/               # Static assets served at /
├── uploads/              # User-uploaded files (create this manually on server)
└── .env.local            # Your secret config — NEVER commit this file
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Public URL of the site — no trailing slash |
| `JWT_SECRET` | ✅ | Random 64-byte hex string for signing auth tokens |
| `EMAIL` | ✅ | Gmail address the app sends emails from |
| `PASSWORD` | ✅ | Gmail **App Password** (not your regular Gmail password) |

---

## 🐛 Troubleshooting

### App crashes on start — database error
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify your `.env.local` — no extra spaces, quotes present, correct password.
- Test the connection manually: `psql postgresql://r4h_user:your_password@localhost:5432/r4h_db`

### `prisma migrate deploy` fails — "role does not exist"
- Re-run the SQL commands in Step 5. Make sure the user and database were created correctly.

### Emails not sending
- You **must** use a Gmail **App Password**, not your regular Gmail password.
- Enable 2-Step Verification first, then go to `Google Account → Security → App Passwords`.

### File uploads not saving
- Make sure the `uploads/` directory exists: `ls /var/www/r4h/uploads`
- If missing, re-run Step 12.
- Check permissions: `ls -la /var/www/r4h/ | grep uploads`

### Port 3000 not reachable from browser
- Open the port: `sudo ufw allow 3000`
- Or set up Nginx (Step 16) to use port 80 instead.

### Nginx shows "502 Bad Gateway"
- The Next.js app is not running. Check: `pm2 status`
- Start it again: `pm2 start npm --name "r4h" -- start`

### `pm2 startup` — app doesn't start after reboot
- After running `pm2 startup`, **you must run the command it prints**.
- Then run `pm2 save` again.

---

## 🧑‍💻 Local Development (Windows / Mac / Linux)

If you want to run the project on your own machine for development:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install

# Create .env.local with your local PostgreSQL credentials
# (same format as shown in Step 8 above)

# Push the schema to your local database (creates all tables)
npx prisma db push

# Seed the database (creates default admin)
npx ts-node prisma/seed.ts

# Start the development server with hot reload
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 License

This project is private and proprietary.
