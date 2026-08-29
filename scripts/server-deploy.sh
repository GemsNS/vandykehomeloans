#!/usr/bin/env bash
# Production deploy — uses the same Node binary as PM2 (ecosystem.config.cjs).
#
# Usage (on the server):
#   cd /var/www/vandykehomeloan.net/backend
#   bash scripts/server-deploy.sh
#
# Deploy a feature branch before merge:
#   DEPLOY_BRANCH=cursor/naf-rates-startup-sync-5e13 bash scripts/server-deploy.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
PM2_NAME="vandyke-home-loan"
PORT="${PORT:-3010}"

echo "==> VanDyke deploy from $ROOT (branch: $DEPLOY_BRANCH)"

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
  git fetch origin "$DEPLOY_BRANCH"
  git checkout "$DEPLOY_BRANCH"
  git pull --ff-only origin "$DEPLOY_BRANCH"
fi

echo "==> npm ci"
rm -rf node_modules
npm ci

echo "==> npm run build"
npm run build
npm run doctor

echo "==> sync rates + public_html"
npm run sync:naf-rates
if [[ ! -f data/naf-rates-meta.json ]]; then
  echo "ERROR: NAF rate sync failed — data/naf-rates-meta.json was not created."
  exit 1
fi
echo "NAF meta:"
cat data/naf-rates-meta.json
npm run sync:public_html || true

if [[ -f ../public_html/runtime.json ]]; then
  chown "${USER}:www-data" ../public_html/runtime.json 2>/dev/null || true
fi

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_NAME" 2>/dev/null || true
fi
echo "==> pm2 start ecosystem.config.cjs"
pm2 start ecosystem.config.cjs
pm2 save

echo "==> waiting for app on 127.0.0.1:${PORT}"
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf "http://127.0.0.1:${PORT}/" >/dev/null; then
    break
  fi
  sleep 2
done

pm2 status

HTTP_CODE="$(curl -s -o /tmp/vd-home.html -w '%{http_code}' "http://127.0.0.1:${PORT}/" || echo 000)"
echo "Homepage HTTP ${HTTP_CODE}"

if [[ "$HTTP_CODE" == "200" ]]; then
  RATE_ASOF="$(grep -oE '[0-9]{1,2}:[0-9]{2}AM PT on [0-9]{1,2}/[0-9]{1,2}/[0-9]{4}' /tmp/vd-home.html | head -1 || true)"
  OG_TITLE="$(grep -oE 'property="og:title" content="[^"]+"' /tmp/vd-home.html | head -1 || true)"
  if [[ -n "$RATE_ASOF" ]]; then
    echo "Rates stamp: $RATE_ASOF"
  else
    echo "WARN: rate as-of stamp not found in homepage HTML"
  fi
  if [[ -n "$OG_TITLE" ]]; then
    echo "Link preview: $OG_TITLE"
  fi
else
  echo "WARN: backend not responding on ${PORT} (check: pm2 logs ${PM2_NAME})"
fi

echo "Done."
