# VanDyke Home Loans

Production web application for [vandyke.loans](https://vandyke.loans) — live published rates, mortgage calculators, lead capture, and a protected broker admin portal.

**Deployment:** see [DEPLOYMENT.md](./DEPLOYMENT.md) for the shared GCP Ubuntu 18.04 layout (`/var/www/vandykehomeloan.net/{public_html,backend}`), NVM Node 24, GLIBC 2.28, PM2, Apache ProxyPass, and Certbot.

## Stack (pure JS/TS)

- Next.js 15 App Router + React 19
- Tailwind CSS **v3.4** (PostCSS — not v4 Oxide)
- Drizzle ORM + `postgres` (postgres.js)
- Radix UI / shadcn patterns, Recharts, Zod, react-hook-form

Native engines are banned on the host (Ubuntu 18.04 + custom GLIBC 2.28): no Prisma, no Tailwind v4, no `sharp`. Next image optimization is disabled. All npm scripts run through `scripts/with-glibc.mjs`, which prepends `~/glibc-2.28/build` to `LD_LIBRARY_PATH` on Linux.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without `DATABASE_URL`, the public site serves fallback rates and brokers. Admin mutations require Postgres:

```bash
npm run db:push
npm run db:seed
```

Admin login uses `ADMIN_PASSWORD` (defaults to `vandyke-admin` in development).

## Key paths

| Path | Purpose |
| --- | --- |
| `/lib/mortgage-math/` | P&I, amortization, APR, DTI, affordability, refinance break-even |
| `/db/schema.ts` | Drizzle models: `rates`, `brokers`, `leads` |
| `/actions/` | Server Actions for leads, rates, brokers, auth |
| `/admin` | Protected CMS: rates, lead pipeline, broker directory |
| `/privacy` | Privacy Policy |
| `/licensing` | NMLS, Equal Housing, rate & calculator disclosures |

## Compliance surfaces

- Footer: Equal Housing / ECOA language, company and LO NMLS IDs, Privacy & Licensing links
- Rate board: Rate + APR + points/cost and MAP-style advertising disclaimer
- Calculators: estimate-only disclaimer on every tool
- Lead funnel: TCPA-style consent with Privacy Policy link
- SEO: document and social titles always include **VanDyke Home Loans**
