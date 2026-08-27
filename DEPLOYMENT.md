# VanDyke Home Loans — Deployment

Production target: **https://vandykehomeloans.net**

This is a Next.js 15 App Router app (Node server). A separate static demo can publish to GitHub Pages without Postgres or the admin portal.

## Environments

| Surface | Command | Needs Postgres | Admin `/admin` |
| --- | --- | --- | --- |
| Local / production Node | `npm run build` → `npm start` | Recommended | Yes |
| Static GitHub Pages demo | `npm run build:demo` → `npm run deploy:demo` | No | No |

## Required environment variables

Copy `.env.example` to `.env.local` (local) or set the same keys in your host’s secret store.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production (for live rates, brokers, leads) | Postgres connection string for Drizzle / postgres.js |
| `ADMIN_PASSWORD` | Production | Password for `/admin` login |
| `ADMIN_SESSION_SECRET` | Production | Long random string used to sign admin session cookies |

Without `DATABASE_URL`, the public site still boots and serves fallback rates/brokers. Admin mutations that write to the database will not work until Postgres is configured.

### Generate a session secret

```bash
openssl rand -base64 48
```

## Production checklist

1. **DNS** — Point `vandykehomeloans.net` (and `www` if used) at your Node host or reverse proxy. Terminate TLS at the edge.
2. **Env** — Set `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the host. Never commit `.env*`.
3. **Database** — Provision Postgres 14+, then:

   ```bash
   npm ci
   npm run db:push
   npm run db:seed
   ```

4. **Build & run**

   ```bash
   npm ci
   npm run build
   npm start
   ```

   Default Next listen port is `3000`. Put nginx, Caddy, or your platform’s proxy in front with HTTPS.

5. **Post-deploy verification**
   - Home title / Open Graph name is **VanDyke Home Loans**
   - `/privacy` and `/licensing` load and appear in the footer
   - Rate board shows Rate **and** APR
   - Lead form consent links to Privacy Policy
   - `/admin` requires login and is `noindex`
   - `/robots.txt` disallows `/admin`
   - `/sitemap.xml` includes public routes

6. **Compliance content owners** — Keep NMLS IDs, Equal Housing language, rate “as of” stamps (`NAF_PUBLISHED_RATES` in `lib/company.ts`), and Privacy / Licensing pages current whenever team or lender details change.

## Suggested Node hosts

Any platform that runs `next start` with Node 20+ works (Vercel, Railway, Render, Fly.io, a VPS with systemd, etc.).

### Example: Vercel

1. Import the GitHub repo.
2. Framework preset: Next.js.
3. Add `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
4. Deploy. Run `db:push` / `db:seed` once against the production database (CI job or local with prod URL).
5. Attach the custom domain `vandykehomeloans.net`.

Native engines are banned in some cloud-agent images used for development; production Linux images with standard glibc do not need `scripts/with-glibc.mjs`, but the npm scripts already wrap Next safely for both.

### Example: VPS (systemd)

```bash
# as deploy user in the app directory
git pull
npm ci
npm run build

# /etc/systemd/system/vandyke.service
# [Service]
# WorkingDirectory=/var/www/vandykehomeloans
# EnvironmentFile=/var/www/vandykehomeloans/.env
# ExecStart=/usr/bin/npm start
# Restart=always
```

## Database operations

| Script | When |
| --- | --- |
| `npm run db:push` | Apply `db/schema.ts` to Postgres |
| `npm run db:seed` | Seed initial rates / brokers |

Schema lives in `db/schema.ts`. Mutations go through Server Actions in `actions/`.

## Static demo (GitHub Pages)

The GitHub Pages preview is **closed for construction** and password-gated.

```bash
export DEMO_GATE_PASSWORD='your-preview-password'
npm run build:demo    # writes out/ and injects the construction gate
npm run deploy:demo   # force-pushes out/ to gh-pages
```

Live demo URL: https://gemsns.github.io/vandykehomeloans/

| Detail | Behavior |
| --- | --- |
| Public visitors | “Under construction” screen only; `robots.txt` disallows all crawlers |
| Unlock | Enter `DEMO_GATE_PASSWORD` on `/gate.html`; session kept in `sessionStorage` for that browser tab session |
| Mechanism | Locked app pages immediately redirect to a standalone `gate.html` (no Next.js), so the marketing UI cannot flash through |
| Limitation | GitHub Pages cannot do HTTP Basic Auth on a public site. The gate hides the UI; exported static files are still fetchable if someone knows direct asset URLs. Do not put secrets in the demo export. |

`DEMO_GATE_PASSWORD` is **required** for `build:demo` / `deploy:demo`. Only a SHA-256 hash of the password is embedded in the published `demo-gate.js`.

Demo builds set `DEMO_EXPORT=1` / `NEXT_PUBLIC_DEMO=1`, strip admin and server actions, and use a client-side lead stub. Do not treat the demo as the compliance production surface for lead capture.

## Security headers

Production `next.config.ts` sends:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera/mic/geo disabled)
- `Strict-Transport-Security` (enable only behind HTTPS)

`poweredByHeader` is disabled.

## Brand / link-preview metadata

Canonical site name is **VanDyke Home Loans** (`SITE_NAME` in `lib/company.ts`). Root and page metadata set:

- Document `<title>` via `pageMetadata()` → always includes `VanDyke Home Loans`
- `og:site_name`, `og:title`, Twitter title
- Shared OG image: `/brand/vandyke-home-loans-logo.png`
- Icons / apple touch icon from the same brand asset

After deploy, validate with Facebook Sharing Debugger, LinkedIn Post Inspector, or similar.

## Rollback

Redeploy the previous git SHA / platform deployment. Database rollbacks are manual — take a Postgres snapshot before schema pushes in production.
