# VanDyke Home Loans — Deployment

Production target: **https://vandykehomeloans.net**

Next.js 15 App Router (Node server) on **Ubuntu 18.04**, **Node v24 via NVM**, **custom GLIBC 2.28** at `~/glibc-2.28/build`. npm scripts already wrap Next through `scripts/with-glibc.mjs`.

A static GitHub Pages demo can also publish without Postgres/admin (optional).

---

## 1. Environments

| Surface | Command | Postgres | Admin `/admin` |
| --- | --- | --- | --- |
| Production Node (this guide) | `npm run build` → PM2 `npm start` | Recommended | Yes (middleware-protected) |
| Static GitHub Pages demo | `npm run build:demo` → `npm run deploy:demo` | No | No |

---

## 2. Required environment variables

Create `/var/www/vandykehomeloans/.env` on the server (never commit secrets):

```bash
# Postgres (postgres.js / Drizzle)
DATABASE_URL=postgres://USER:PASSWORD@127.0.0.1:5432/vandyke

# Admin portal (/admin)
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=$(openssl rand -base64 48)

# Next listens here; Apache proxies to it
PORT=3010
HOSTNAME=127.0.0.1
NODE_ENV=production
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production (live rates / brokers / leads) | Postgres connection string |
| `ADMIN_PASSWORD` | Yes | `/admin` login |
| `ADMIN_SESSION_SECRET` | Yes | Signs admin session cookies |
| `PORT` | Recommended | App port (use a free port if other apps use 3000) |
| `HOSTNAME` | Recommended | Bind to localhost behind Apache |

Without `DATABASE_URL`, the public site still boots with fallback rates/brokers; admin writes will not persist.

---

## 3. Production checklist (before DNS cutover)

- [ ] Node `v24.x` via NVM; `~/glibc-2.28/build` present
- [ ] Repo cloned; `.env` filled; `npm ci` + `npm run build` succeed
- [ ] Postgres DB created; `npm run db:push` + `npm run db:seed`
- [ ] PM2 process running on `127.0.0.1:$PORT`
- [ ] Apache vhost + ProxyPass for `vandykehomeloans.net`
- [ ] TLS cert covers `vandykehomeloans.net` (+ `www` if used)
- [ ] DNS A/AAAA points at this server
- [ ] Verify: home title **VanDyke Home Loans**, `/privacy`, `/licensing`, `/admin` login, rates show APR

---

## 4. Step-by-step: add the site to an existing Ubuntu 18.04 server

Assumes you already run other sites on this machine (e.g. Apache + Let’s Encrypt), with:

- Node.js **v24.16.0** (NVM)
- GLIBC **2.28** in `~/glibc-2.28/build`
- Ubuntu **18.04 LTS**

Run as your deploy user (the one that owns NVM + glibc). Use `sudo` only where shown.

### 4.1 Shell prep

```bash
# Load NVM (adjust path if your nvm lives elsewhere)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24

node -v          # expect v24.16.0
ls ~/glibc-2.28/build | head  # expect glibc build tree

# Optional: confirm LD path the app will use
echo ~/glibc-2.28/build
```

### 4.2 Install app files

```bash
sudo mkdir -p /var/www/vandykehomeloans
sudo chown "$USER":"$USER" /var/www/vandykehomeloans
cd /var/www/vandykehomeloans

git clone https://github.com/GemsNS/vandykehomeloans.git .
# or: git pull origin main   if already cloned

git checkout main
git pull origin main
```

### 4.3 Environment file

```bash
cd /var/www/vandykehomeloans
cp .env.example .env
nano .env   # set DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET, PORT, HOSTNAME, NODE_ENV
chmod 600 .env
```

Pick a **free** port (example `3010`) if `3000` is taken:

```bash
ss -tlnp | grep -E '3000|3010|3011' || netstat -tlnp | grep -E '3000|3010'
```

### 4.4 Postgres database

If Postgres is already on the box:

```bash
sudo -u postgres psql <<'SQL'
CREATE USER vandyke WITH PASSWORD 'choose-a-strong-password';
CREATE DATABASE vandyke OWNER vandyke;
GRANT ALL PRIVILEGES ON DATABASE vandyke TO vandyke;
SQL
```

Put the matching URL in `.env`:

```bash
DATABASE_URL=postgres://vandyke:choose-a-strong-password@127.0.0.1:5432/vandyke
```

### 4.5 Install, migrate, build

```bash
cd /var/www/vandykehomeloans
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24

npm ci
npm run db:push
npm run db:seed
npm run build
```

`npm run build` / `start` already invoke `scripts/with-glibc.mjs` so Node 24 can load against your custom GLIBC.

### 4.6 Run with PM2 (recommended on a multi-site box)

```bash
npm install -g pm2

# From the app directory — uses ecosystem.config.cjs
cd /var/www/vandykehomeloans
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# run the command pm2 prints (sudo env PATH=...)

pm2 status
curl -sI http://127.0.0.1:3010 | head   # use your PORT
```

Update / restart later:

```bash
cd /var/www/vandykehomeloans
git pull origin main
npm ci
npm run db:push    # only when schema changes
npm run build
pm2 restart vandyke-home-loans
```

---

## 5. Apache: add the vhost on an existing server

### 5.1 Enable proxy modules (once per server)

```bash
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo systemctl reload apache2
```

### 5.2 Create the site config

```bash
sudo nano /etc/apache2/sites-available/vandykehomeloans.net.conf
```

Paste (adjust `PORT` if not `3010`):

```apache
<VirtualHost *:80>
    ServerName vandykehomeloans.net
    ServerAlias www.vandykehomeloans.net

    # After certbot --apache, this block is often redirected to HTTPS automatically.
    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "http"
    ProxyPass        / http://127.0.0.1:3010/
    ProxyPassReverse / http://127.0.0.1:3010/

    ErrorLog ${APACHE_LOG_DIR}/vandykehomeloans-error.log
    CustomLog ${APACHE_LOG_DIR}/vandykehomeloans-access.log combined
</VirtualHost>
```

Enable and reload:

```bash
sudo a2ensite vandykehomeloans.net.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## 6. TLS: add this domain to an **existing** Let’s Encrypt certificate

You have two common cases on a multi-site Ubuntu box.

### Option A — Expand an existing cert (same cert, more names)

List current certs:

```bash
sudo certbot certificates
```

Note the **Certificate Name** (e.g. `wearencc.org` or `pinnacle…`) and its current domains. Expand it to include VanDyke:

```bash
# Replace CERT_NAME and list EVERY domain that must remain on the cert, plus the new ones.
sudo certbot certonly --apache --cert-name CERT_NAME --expand \
  -d existing-domain.com \
  -d www.existing-domain.com \
  -d vandykehomeloans.net \
  -d www.vandykehomeloans.net
```

**Important:** With `--expand`, pass the **full** final domain list (old + new). Omitting an old name can drop it from the cert.

Then point the VanDyke SSL vhost at that cert’s files (paths from `certbot certificates`), or run Option B’s `--apache` installer against only this vhost.

### Option B — New cert just for VanDyke (simplest; recommended)

Keep other sites on their current certs; issue a dedicated cert:

```bash
sudo certbot --apache -d vandykehomeloans.net -d www.vandykehomeloans.net
```

Certbot will create/update the HTTPS vhost (often `vandykehomeloans.net-le-ssl.conf`) with:

- `SSLCertificateFile /etc/letsencrypt/live/vandykehomeloans.net/fullchain.pem`
- `SSLCertificateKeyFile /etc/letsencrypt/live/vandykehomeloans.net/privkey.pem`

Confirm proxy lines exist on **443** as well:

```apache
ProxyPreserveHost On
RequestHeader set X-Forwarded-Proto "https"
ProxyPass        / http://127.0.0.1:3010/
ProxyPassReverse / http://127.0.0.1:3010/
```

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### Renewals

```bash
sudo certbot renew --dry-run
```

Certbot’s timer/cron on the server continues to renew; no special VanDyke step beyond ensuring the name stays on the cert.

---

## 7. DNS

At your DNS host:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` / `vandykehomeloans.net` | your server public IP |
| A | `www` | same IP (or CNAME → apex) |

Wait for propagation, then:

```bash
curl -sI https://vandykehomeloans.net | head
curl -s https://vandykehomeloans.net | grep -o '<title>[^<]*</title>'
```

---

## 8. Post-deploy verification

```bash
curl -sI https://vandykehomeloans.net/privacy | head
curl -sI https://vandykehomeloans.net/licensing | head
curl -sI https://vandykehomeloans.net/admin | head   # should redirect to login
curl -s https://vandykehomeloans.net/robots.txt
curl -s https://vandykehomeloans.net/sitemap.xml | head
pm2 logs vandyke-home-loans --lines 50
```

Browser checks:

- Title / link preview includes **VanDyke Home Loans**
- Rate board shows Rate **and** APR
- `/admin` prompts for password
- Footer shows NMLS + Privacy + Licensing

---

## 9. Optional: GitHub Pages static demo (no gate)

Public preview without Postgres/admin:

```bash
cd /path/to/vandykehomeloans
npm run build:demo
npm run deploy:demo
```

Live: https://gemsns.github.io/vandykehomeloans/

Demo builds set `DEMO_EXPORT=1` / `NEXT_PUBLIC_DEMO=1`, strip admin and server actions, and use a client-side lead stub. Prefer production for real lead capture.

---

## 10. Security headers

Production `next.config.ts` sends `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`. `poweredByHeader` is off. Admin routes are guarded by `middleware.ts`.

---

## 11. Rollback

```bash
cd /var/www/vandykehomeloans
git log --oneline -5
git checkout PREVIOUS_SHA
npm ci && npm run build
pm2 restart vandyke-home-loans
```

Database rollbacks are manual — snapshot Postgres before `db:push` in production.
