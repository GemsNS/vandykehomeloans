# VanDyke Home Loans — Deployment (shared GCP Ubuntu 18.04)

Production: **https://vandykehomeloans.net**

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
/var/www/vandykehomeloans.net/
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
| Domain folder | `/var/www/vandykehomeloans.net` |
| Static root | `.../public_html` |
| Node app | `.../backend` |
| Localhost port | **3010** (change only if taken; keep unique) |
| PM2 name | `vandyke-home-loans` |

---

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
sudo mkdir -p /var/www/vandykehomeloans.net/{public_html/uploads,backend}
sudo chown -R "$DEPLOY_USER":www-data /var/www/vandykehomeloans.net
sudo find /var/www/vandykehomeloans.net -type d -exec chmod 775 {} \;
sudo find /var/www/vandykehomeloans.net -type f -exec chmod 664 {} \;
```

Seed `public_html` from the repo templates (after clone, or copy now):

```bash
# After backend clone (step 3), sync static helpers:
cp /var/www/vandykehomeloans.net/backend/deploy/public_html/* \
   /var/www/vandykehomeloans.net/public_html/
mkdir -p /var/www/vandykehomeloans.net/public_html/uploads
```

---

## 3. Install the Next.js app into `backend/`

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24

cd /var/www/vandykehomeloans.net/backend
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
cd /var/www/vandykehomeloans.net/backend
npm ci
npm run db:push
npm run db:seed
npm run build
```

Sync `runtime.json` into DocumentRoot:

```bash
cp public/runtime.json /var/www/vandykehomeloans.net/public_html/runtime.json
cp deploy/public_html/index.html /var/www/vandykehomeloans.net/public_html/index.html
chown "$DEPLOY_USER":www-data /var/www/vandykehomeloans.net/public_html/runtime.json
```

---

## 4. PM2 — Node on 127.0.0.1:3010 only

```bash
npm install -g pm2
cd /var/www/vandykehomeloans.net/backend
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
cd /var/www/vandykehomeloans.net/backend
git pull origin main
npm ci
npm run build
pm2 restart vandyke-home-loans
cp public/runtime.json /var/www/vandykehomeloans.net/public_html/runtime.json
```

---

## 5. Apache vhosts (new site only)

```bash
sudo cp /var/www/vandykehomeloans.net/backend/deploy/apache/vandykehomeloans.net.conf \
  /etc/apache2/sites-available/

# Optional SSL template (Certbot often writes *-le-ssl.conf itself):
sudo cp /var/www/vandykehomeloans.net/backend/deploy/apache/vandykehomeloans.net-le-ssl.conf \
  /etc/apache2/sites-available/

sudo a2ensite vandykehomeloans.net.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Confirm ProxyPass targets **3010** and paths `/api`, `/uploads`, `/_next`, `/`.

---

## 6. TLS with Certbot on the existing multi-site box

### Recommended: new certificate for this domain only

Does not rewrite other sites’ certs:

```bash
sudo certbot --apache -d vandykehomeloans.net -d www.vandykehomeloans.net
```

Afterward, open the generated SSL vhost and ensure it still has the same ProxyPass block as `deploy/apache/vandykehomeloans.net-le-ssl.conf` (Certbot sometimes leaves only DocumentRoot). Reload:

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
  -d vandykehomeloans.net \
  -d www.vandykehomeloans.net
```

Then point the VanDyke SSL vhost `SSLCertificateFile` / `KeyFile` at that cert’s `live/` paths, keep ProxyPass to `127.0.0.1:3010`, and reload Apache.

```bash
sudo certbot renew --dry-run
```

---

## 7. DNS

| Type | Name | Value |
| --- | --- | --- |
| A | vandykehomeloans.net | this VM’s public IP |
| A or CNAME | www | same IP / apex |

```bash
curl -sI https://vandykehomeloans.net | head
curl -s https://vandykehomeloans.net/runtime.json
curl -sI https://vandykehomeloans.net/admin | head
```

---

## 8. FTP / file ownership

After FTP uploads into this site tree:

```bash
export DEPLOY_USER="$USER"
sudo chown -R "$DEPLOY_USER":www-data /var/www/vandykehomeloans.net
sudo find /var/www/vandykehomeloans.net -type d -exec chmod 775 {} \;
sudo find /var/www/vandykehomeloans.net -type f -exec chmod 664 {} \;
chmod 600 /var/www/vandykehomeloans.net/backend/.env
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

## 10. Verification checklist

- [ ] `pm2 show vandyke-home-loans` → online, port 3010, `127.0.0.1`
- [ ] `ss -tlnp | grep 3010` → only localhost
- [ ] https://vandykehomeloans.net title contains **VanDyke Home Loans**
- [ ] `/privacy`, `/licensing`, `/runtime.json` OK
- [ ] `/admin` redirects to login (middleware)
- [ ] Other sites on the VM still respond (smoke-test one existing domain)
- [ ] `sudo apache2ctl -S` shows distinct vhosts; no accidental overwrite

---

## 11. Rollback (this site only)

```bash
cd /var/www/vandykehomeloans.net/backend
git log --oneline -5
git checkout PREVIOUS_SHA
npm ci && npm run build
pm2 restart vandyke-home-loans
```

Disable only this site if needed:

```bash
sudo a2dissite vandykehomeloans.net.conf vandykehomeloans.net-le-ssl.conf
sudo systemctl reload apache2
pm2 stop vandyke-home-loans
```

---

## 12. Optional GitHub Pages demo

```bash
cd /path/to/checkout
npm run build:demo && npm run deploy:demo
```

https://gemsns.github.io/vandykehomeloans/ — static, no Postgres/admin. Prefer this VM for production leads and `/admin`.
