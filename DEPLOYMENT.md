# VanDyke Home Loans — Deployment (shared GCP Ubuntu 18.04)

Production: **https://vandykehomeloan.net**

This guide matches the shared VM conventions used by other sites on the box:

- **OS:** Ubuntu 18.04 LTS  
- **Web:** Apache + Certbot (multi-site)  
- **Layout:** `/var/www/<domain>/{public_html,backend}`  
- **Node:** NVM only (not apt) — **v24.16.0**  
- **GLIBC:** custom **2.28** at `~/glibc-2.28/build`  
- **Process manager:** PM2  
- **Bind:** Node listens on **127.0.0.1** only (unique port **3010**)  
- **Secrets:** `backend/.env` only — never commit  
- **FTP/files:** `chown USER:www-data` so deploy user and Apache can both access  

**Do not modify** existing vhosts, certs, PM2 apps, or `/var/www/<other-domain>/` trees.

VanDyke is a **Next.js 15 App Router** app (UI + Server Actions + `/admin`). Unlike a static HTML + `/api` split, Apache must **ProxyPass `/` (and `/_next`)** to Node in addition to `/api` and `/uploads`. Frontend same-origin config lives in `runtime.json` (`apiBase: "/api"`).

---

## Layout on the server

```text
/var/www/vandykehomeloan.net/
  public_html/          # Apache DocumentRoot (static fallback + runtime.json)
    runtime.json
    index.html          # unused while ProxyPass / is active
    uploads/            # optional static uploads dir
  backend/              # Next.js app (git clone) — PM2 runs from here
    .env                # secrets (chmod 600)
    ecosystem.config.cjs
    ...
```

| Piece | Path / value |
| --- | --- |
| Domain folder | `/var/www/vandykehomeloan.net` |
| Static root | `.../public_html` |
| Node app | `.../backend` |
| Localhost port | **3010** (change only if taken; keep unique) |
| PM2 name | `vandyke-home-loan` |

**Critical:** Ubuntu 18.04’s default shell `node` is often **v16**. PM2 runs a **different** Node binary (see `ecosystem.config.cjs` → `interpreter`). If you run `npm ci` under shell Node 16 while PM2 uses another Node, `node_modules` gets corrupted (`esbuild` mismatch) and `npm run build` may **segfault**. Always run npm with the PM2 interpreter:

```bash
export PATH="$(dirname "$(node scripts/resolve-node.mjs)"):$PATH"
node -v && npm ci && npm run build
```

Quick deploy:

```bash
cd /var/www/vandykehomeloan.net/backend
npm run deploy
# same as: bash scripts/server-deploy.sh
```

Deploy a branch before it is merged to `main`:

```bash
DEPLOY_BRANCH=cursor/naf-rates-startup-sync-5e13 npm run deploy
```

The script uses the PM2 Node binary, runs `npm ci`, `npm run build`, syncs NAF rates, restarts PM2, and prints the rate stamp + `og:title` from the homepage.


## 1. One-time server modules

```bash
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo systemctl reload apache2
```

Confirm NVM Node 24 + glibc (do **not** install Node from apt):

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24
node -v    # v24.16.0
ls "$HOME/glibc-2.28/build" | head
```

Pick a free port (must stay unique vs other PM2 apps):

```bash
ss -tlnp | grep -E '3010|3000|3001|3020' || true
```

---

## 2. Create the site tree (new folder only)

```bash
export DEPLOY_USER="$USER"   # FTP/SSH user that owns other sites
sudo mkdir -p /var/www/vandykehomeloan.net/{public_html/uploads,backend}
sudo chown -R "$DEPLOY_USER":www-data /var/www/vandykehomeloan.net
sudo find /var/www/vandykehomeloan.net -type d -exec chmod 775 {} \;
sudo find /var/www/vandykehomeloan.net -type f -exec chmod 664 {} \;
```

Seed `public_html` from the repo templates (after clone, or copy now):

```bash
# After backend clone (step 3), sync static helpers:
cp /var/www/vandykehomeloan.net/backend/deploy/public_html/* \
   /var/www/vandykehomeloan.net/public_html/
mkdir -p /var/www/vandykehomeloan.net/public_html/uploads
```

---

## 3. Install the Next.js app into `backend/`

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24

cd /var/www/vandykehomeloan.net/backend
git clone https://github.com/GemsNS/vandykehomeloans.git .
git checkout main
git pull origin main

cp .env.example .env
nano .env
chmod 600 .env
```

Minimum `.env`:

```bash
DATABASE_URL=postgres://vandyke:PASSWORD@127.0.0.1:5432/vandyke
ADMIN_PASSWORD=long-unique-admin-password
ADMIN_SESSION_SECRET=paste-openssl-rand-base64-48
PORT=3010
HOSTNAME=127.0.0.1
NODE_ENV=production
```

```bash
openssl rand -base64 48
```

Postgres (new DB only — do not touch other databases):

```bash
sudo -u postgres psql <<'SQL'
CREATE USER vandyke WITH PASSWORD 'choose-a-strong-password';
CREATE DATABASE vandyke OWNER vandyke;
GRANT ALL PRIVILEGES ON DATABASE vandyke TO vandyke;
SQL
```

Build (scripts already wrap GLIBC 2.28 via `scripts/with-glibc.mjs`):

```bash
cd /var/www/vandykehomeloan.net/backend
npm ci
npm run db:push
npm run db:seed
npm run build
```

Sync `runtime.json` into DocumentRoot:

```bash
npm run sync:public_html
# or manually:
cp public/runtime.json /var/www/vandykehomeloan.net/public_html/runtime.json
cp deploy/public_html/index.html /var/www/vandykehomeloan.net/public_html/index.html
chown "$DEPLOY_USER":www-data /var/www/vandykehomeloan.net/public_html/runtime.json
```

`sync:public_html` falls back to `deploy/public_html/runtime.json` if `public/runtime.json` is missing.

---

## 4. PM2 — Node on 127.0.0.1:3010 only

```bash
npm install -g pm2
cd /var/www/vandykehomeloan.net/backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# run the sudo env PATH=... command that pm2 prints

pm2 status
curl -sI http://127.0.0.1:3010/ | head
curl -s http://127.0.0.1:3010/runtime.json
```

`ecosystem.config.cjs` loads `backend/.env`, forces `HOSTNAME=127.0.0.1`, sets `LD_LIBRARY_PATH` for `~/glibc-2.28/build`, and uses NVM’s Node binary.

Update deploy later:

```bash
cd /var/www/vandykehomeloan.net/backend
bash scripts/server-deploy.sh
```

Or step-by-step (use PM2's Node for npm — see `node scripts/resolve-node.mjs`):

```bash
cd /var/www/vandykehomeloan.net/backend
export PATH="$(dirname "$(node scripts/resolve-node.mjs)"):$PATH"
git checkout -- ecosystem.config.cjs   # if pull blocked by local edits
git pull origin main
rm -rf node_modules && npm ci
npm run build
npm run sync:naf-rates
npm run sync:public_html
pm2 delete vandyke-home-loan 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
```


Verify titles (should **not** include “Powered by New American Funding”):

```bash
curl -s https://vandykehomeloan.net/ | grep -o '<title>[^<]*</title>'
curl -s https://vandykehomeloan.net/runtime.json
```

### NAF published rates (auto-sync)

Rates are **not** static. The app pulls New American Funding’s public mortgage rates page on a schedule (default every 30 minutes when pages are served) and updates Postgres when `DATABASE_URL` is set.

Manual sync on the server (requires PM2 Node in PATH — see section 4):

```bash
cd /var/www/vandykehomeloan.net/backend
npm run sync:naf-rates
cat data/naf-rates-meta.json
pm2 restart vandyke-home-loan --update-env
```

`sync:naf-rates` uses `run-pm2-node.mjs` to exec the PM2 Node binary directly (works even when shell `node` is v16).

Optional hourly cron (set `RATES_SYNC_SECRET` in `.env` first):

```bash
0 * * * * curl -fsS -H "Authorization: Bearer YOUR_RATES_SYNC_SECRET" https://vandykehomeloan.net/api/cron/sync-rates
```

Verify the “as of” line on the homepage matches NAF (e.g. `9:00AM PT on …`).

---

## 5. Apache vhosts (new site only)

```bash
sudo cp /var/www/vandykehomeloan.net/backend/deploy/apache/vandykehomeloan.net.conf \
  /etc/apache2/sites-available/

# Optional SSL template (Certbot often writes *-le-ssl.conf itself):
sudo cp /var/www/vandykehomeloan.net/backend/deploy/apache/vandykehomeloan.net-le-ssl.conf \
  /etc/apache2/sites-available/

sudo a2ensite vandykehomeloan.net.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Confirm ProxyPass targets **3010** and paths `/api`, `/uploads`, `/_next`, `/`.

---

## 6. TLS with Certbot on the existing multi-site box

### Recommended: new certificate for this domain only

Does not rewrite other sites’ certs:

```bash
sudo certbot --apache -d vandykehomeloan.net -d www.vandykehomeloan.net
```

Afterward, open the generated SSL vhost and ensure it still has the same ProxyPass block as `deploy/apache/vandykehomeloan.net-le-ssl.conf` (Certbot sometimes leaves only DocumentRoot). Reload:

```bash
sudo apache2ctl configtest && sudo systemctl reload apache2
```

### Alternate: expand an **existing** Let’s Encrypt cert

```bash
sudo certbot certificates
```

Re-issue with **every** old name plus the new ones (omitting an old name drops it):

```bash
sudo certbot certonly --apache --cert-name EXISTING_CERT_NAME --expand \
  -d existing-site.com \
  -d www.existing-site.com \
  -d vandykehomeloan.net \
  -d www.vandykehomeloan.net
```

Then point the VanDyke SSL vhost `SSLCertificateFile` / `KeyFile` at that cert’s `live/` paths, keep ProxyPass to `127.0.0.1:3010`, and reload Apache.

```bash
sudo certbot renew --dry-run
```

---

## 7. DNS

| Type | Name | Value |
| --- | --- | --- |
| A | vandykehomeloan.net | this VM's public IP |
| A or CNAME | www | same IP / apex |

```bash
curl -sI https://vandykehomeloan.net | head
curl -s https://vandykehomeloan.net/runtime.json
curl -sI https://vandykehomeloan.net/admin | head
```

---

## 8. FTP / file ownership

After FTP uploads into this site tree:

```bash
export DEPLOY_USER="$USER"
sudo chown -R "$DEPLOY_USER":www-data /var/www/vandykehomeloan.net
sudo find /var/www/vandykehomeloan.net -type d -exec chmod 775 {} \;
sudo find /var/www/vandykehomeloan.net -type f -exec chmod 664 {} \;
chmod 600 /var/www/vandykehomeloan.net/backend/.env
```

Never chmod/chown other domains under `/var/www/`.

---

## 9. Secrets

| File | Git |
| --- | --- |
| `backend/.env` | **Ignored** (`.gitignore` has `.env`) |
| `backend/.env.example` | Committed (placeholders only) |

Do not put passwords in Apache configs, `runtime.json`, or the repo.

---

## 10. Recovery (site errored / pull or npm failed)

### Root cause (typical)

1. `git pull` blocked by local `ecosystem.config.cjs` edits → **new code never landed** (`sync:naf-rates` missing).
2. `npm ci` run under **shell Node 16** while PM2 uses a different Node → **corrupt `node_modules`** (`Expected 0.28.2 but got 0.19.12`).
3. `npm run build` **segfault** → system Node 16 + GLIBC wrapper (`with-glibc.mjs`) is incompatible.
4. `pm2 restart` with broken `node_modules` / missing build → **errored** loop.

This is a **deploy environment mismatch**, not a runtime bug in the site code. Fix by reinstalling with the PM2 Node binary (without changing your default shell node):

```bash
cd /var/www/vandykehomeloan.net/backend
export PATH="$(dirname "$(node scripts/resolve-node.mjs)"):$PATH"
node -v

git checkout -- ecosystem.config.cjs
git pull origin main
bash scripts/server-deploy.sh
```

If `server-deploy.sh` is not on the server yet:

```bash
export PATH="$(dirname "$(node scripts/resolve-node.mjs)"):$PATH"
git checkout -- ecosystem.config.cjs && git pull origin main
rm -rf node_modules && npm ci && npm run build
pm2 delete vandyke-home-loan 2>/dev/null || true
pm2 start ecosystem.config.cjs && pm2 save
```

Set `NODE_INTERPRETER` in `.env` if your compatible Node lives outside NVM.

```bash
pm2 logs vandyke-home-loan --lines 50
```

---

## 11. Verification checklist

- [ ] `pm2 show vandyke-home-loan` → online, port 3010, `127.0.0.1`
- [ ] `ss -tlnp | grep 3010` → only localhost
- [ ] https://vandykehomeloan.net title contains **VanDyke Home Loans**
- [ ] `/privacy`, `/licensing`, `/runtime.json` OK
- [ ] `/admin` redirects to login (middleware)
- [ ] Other sites on the VM still respond (smoke-test one existing domain)
- [ ] `sudo apache2ctl -S` shows distinct vhosts; no accidental overwrite

---

## 12. Rollback (this site only)

```bash
cd /var/www/vandykehomeloan.net/backend
git log --oneline -5
git checkout PREVIOUS_SHA
npm ci && npm run build
pm2 restart vandyke-home-loan --update-env
```

Disable only this site if needed:

```bash
sudo a2dissite vandykehomeloan.net.conf vandykehomeloan.net-le-ssl.conf
sudo systemctl reload apache2
pm2 stop vandyke-home-loan
```

---

## 13. Optional GitHub Pages demo

```bash
cd /path/to/checkout
npm run build:demo && npm run deploy:demo
```

https://gemsns.github.io/vandykehomeloans/ — static, no Postgres/admin. Prefer this VM for production leads and `/admin`.
