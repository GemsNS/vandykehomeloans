#!/usr/bin/env bash
# Full production deploy for /var/www/vandykehomeloan.net/backend
# Always uses NVM Node 24 + GLIBC 2.28 (never system Node 16).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> VanDyke deploy from $ROOT"

# --- NVM Node 24 (required) ---
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "ERROR: NVM not found at $NVM_DIR/nvm.sh"
  echo "Install NVM and Node 24 before deploying. See DEPLOYMENT.md"
  exit 1
fi
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"

if ! nvm use 24; then
  echo "Installing Node 24..."
  nvm install 24
  nvm use 24
fi

echo "Node: $(node -v) ($(command -v node))"
if [[ "$(node -v)" != v24* ]]; then
  echo "ERROR: Expected Node v24.x, got $(node -v). Aborting."
  exit 1
fi

# --- Git: pull latest main ---
if [[ -d .git ]]; then
  if git status --porcelain -- ecosystem.config.cjs | grep -q .; then
    echo "Stashing local ecosystem.config.cjs (repo version is canonical)..."
    git stash push -m "server-deploy $(date -Iseconds)" -- ecosystem.config.cjs
  fi
  git fetch origin main
  git checkout main
  git pull origin main
fi

# --- Clean install (fixes broken partial npm ci on wrong Node) ---
echo "==> npm ci"
rm -rf node_modules
npm ci

echo "==> npm run build"
npm run build

echo "==> sync rates + public_html"
npm run sync:naf-rates || echo "WARN: sync:naf-rates failed (site may still run on cache)"
npm run sync:public_html || true

if [[ -f ../public_html/runtime.json ]]; then
  chown "${USER}:www-data" ../public_html/runtime.json 2>/dev/null || true
fi

# --- PM2 ---
PM2_NAME="vandyke-home-loan"
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  echo "==> pm2 restart $PM2_NAME"
  pm2 delete "$PM2_NAME" 2>/dev/null || true
fi
echo "==> pm2 start ecosystem.config.cjs"
pm2 start ecosystem.config.cjs
pm2 save

sleep 2
pm2 status
curl -sfI "http://127.0.0.1:3010/" | head -3 || echo "WARN: backend not responding on 3010 yet"
echo "Done."
