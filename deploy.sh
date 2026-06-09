#!/bin/bash
# deploy.sh — runs on the Linux server, triggered by webhook or manually
# Place this at: /var/www/r4h/deploy.sh
# Make executable: chmod +x /var/www/r4h/deploy.sh
#
# ⚠️ IMPORTANT: If your repo is PRIVATE, on the server run ONCE:
#   git remote set-url origin https://<PAT>@github.com/<USER>/r4h.git
# Replace <PAT> with a GitHub Personal Access Token (repo read-only).

set -e  # exit immediately on any error

APP_DIR="/var/www/r4h"          # ← change to your actual server path
APP_NAME="r4h"                  # must match ecosystem.config.js name
LOG_FILE="/var/log/r4h/deploy.log"

mkdir -p /var/log/r4h

echo ""
echo "========================================" | tee -a "$LOG_FILE"
echo "  DEPLOY STARTED: $(date)"               | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

cd "$APP_DIR"

# ── 1. Pull latest code ──────────────────────────────────────────
echo "[deploy] Pulling latest code..." | tee -a "$LOG_FILE"
git pull origin main 2>&1 | tee -a "$LOG_FILE"

# ── 2. Install dependencies ──────────────────────────────────────
echo "[deploy] Installing dependencies..." | tee -a "$LOG_FILE"
npm ci --omit=dev 2>&1 | tee -a "$LOG_FILE"

# ── 3. Run Prisma migrations ─────────────────────────────────────
echo "[deploy] Running Prisma migrations..." | tee -a "$LOG_FILE"
npx prisma migrate deploy 2>&1 | tee -a "$LOG_FILE"

# ── 4. Generate Prisma client ────────────────────────────────────
echo "[deploy] Generating Prisma client..." | tee -a "$LOG_FILE"
npx prisma generate 2>&1 | tee -a "$LOG_FILE"

# ── 5. Build Next.js ─────────────────────────────────────────────
echo "[deploy] Building Next.js app..." | tee -a "$LOG_FILE"
npm run build 2>&1 | tee -a "$LOG_FILE"

# ── 6. Reload PM2 (zero downtime) ───────────────────────────────
echo "[deploy] Reloading PM2..." | tee -a "$LOG_FILE"
pm2 reload "$APP_NAME" --update-env 2>&1 | tee -a "$LOG_FILE"

echo "[deploy] ✅ Deploy complete: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
