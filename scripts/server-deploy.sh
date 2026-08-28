#!/usr/bin/env bash
# Production deploy — uses the same Node binary as PM2 (ecosystem.config.cjs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> VanDyke deploy from $ROOT"

PM2_NODE="$(node scripts/resolve-node.mjs)"
PM2_BIN="$(dirname "$PM2_NODE")"
export PATH="$PM2_BIN:$PATH"

echo "Node: $(node -v) ($PM2_NODE)"
node scripts/check-node.mjs

if [[ -d .git ]]; then
  if git status --porcelain -- ecosystem.config.cjs | grep -q .; then
    echo "Stashing local ecosystem.config.cjs (repo version is canonical)..."
    git stash push -m "server-deploy $(date -Iseconds)" -- ecosystem.config.cjs || true
  fi
  git fetch origin main
  git checkout main
  git pull origin main
fi

echo "==> npm ci"
rm -rf node_modules
npm ci

echo "==> npm run build"
node scripts/run-pm2-node.mjs scripts/next-build.mjs

echo "==> sync rates + public_html"
npm run sync:naf-rates
if [[ ! -f data/naf-rates-meta.json ]]; then
  echo "ERROR: NAF rate sync failed — data/naf-rates-meta.json was not created."
  exit 1
fi
cat data/naf-rates-meta.json
npm run sync:public_html || true

if [[ -f ../public_html/runtime.json ]]; then
  chown "${USER}:www-data" ../public_html/runtime.json 2>/dev/null || true
fi

PM2_NAME="vandyke-home-loan"
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_NAME" 2>/dev/null || true
fi
echo "==> pm2 start ecosystem.config.cjs"
pm2 start ecosystem.config.cjs
pm2 save

sleep 2
pm2 status
curl -sfI "http://127.0.0.1:3010/" | head -3 || echo "WARN: backend not responding on 3010 yet"
echo "Done."
