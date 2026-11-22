import type { NextConfig } from "next";
import { CONTACT } from "./lib/company";

// `npm run build:demo` produces the static GitHub Pages demo at
// https://gemsns.github.io/vandykehomeloans/ — no server, no database.
const isDemoExport = process.env.DEMO_EXPORT === "1";
const demoBasePath = "/vandykehomeloans";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const CANONICAL_ORIGIN = "https://vandyke.loans";
// Single source of truth for the NAF pre-qualification link (also used by ApplyNowButton).
const NAF_PREQUAL_URL = CONTACT.preQual;

// Hosts that serve the same app but should never be indexed. Matched as an anchored regex.
const ALIAS_HOSTS = "(?:(?:www\\.)?vandykehomeloan\\.net|www\\.vandyke\\.loans)";

/**
 * Retired URLs and where their content lives now. Every entry is a single-hop 301:
 * no destination here is itself redirected.
 */
const MOVED_PAGES: { source: string; destination: string }[] = [
  { source: "/about", destination: "/#anthony" },
  { source: "/team", destination: "/#anthony" },
  { source: "/purchase", destination: "/#buy" },
  { source: "/refinance", destination: "/#refinance" },
  { source: "/self-employed-loans", destination: "/programs#self-employed" },
  { source: "/programs/conventional", destination: "/programs#conventional" },
  { source: "/programs/jumbo", destination: "/programs#conventional" },
  { source: "/programs/usda", destination: "/programs#usda" },
  { source: "/programs/non-qm", destination: "/programs#self-employed" },
  { source: "/programs/investors", destination: "/programs#self-employed" },
  { source: "/programs/reverse", destination: "/programs#reverse" },
  { source: "/programs/self-employed", destination: "/programs#self-employed" },
  { source: "/programs/va", destination: "/va-loans" },
  { source: "/programs/fha", destination: "/fha-loans" },
  { source: "/calculators/payment", destination: "/calculators#payment" },
  { source: "/calculators/refinance", destination: "/calculators#refinance" },
  { source: "/calculators/affordability", destination: "/calculators#affordability" },
];

/** Each retired URL with and without a trailing slash, so both forms are one 301. */
const MOVED_PAGE_RULES = MOVED_PAGES.flatMap(({ source, destination }) => [
  { source, destination },
  { source: `${source}/`, destination },
]);

// Paths that keep answering on whichever host they were called (cron API, admin, build assets).
const HOST_AGNOSTIC = "(?!api(?:/|$)|admin(?:/|$)|_next(?:/|$))";

function siteRedirects() {
  const aliasHost = [{ type: "host" as const, value: ALIAS_HOSTS }];
  return [
    // Off-site hand-off stays a temporary 307 so browsers never cache it permanently.
    { source: "/apply", destination: NAF_PREQUAL_URL, permanent: false },
    { source: "/apply/", destination: NAF_PREQUAL_URL, permanent: false },
    // Old URLs on an alias host go straight to their final canonical URL (one hop, not two).
    ...MOVED_PAGE_RULES.map(({ source, destination }) => ({
      source,
      destination: `${CANONICAL_ORIGIN}${destination}`,
      statusCode: 301 as const,
      has: aliasHost,
    })),
    ...MOVED_PAGE_RULES.map(({ source, destination }) => ({
      source,
      destination,
      statusCode: 301 as const,
    })),
    // Everything else on an alias host moves to vandyke.loans (trailing slash dropped in the
    // same hop), except the host-agnostic paths above.
    {
      source: `/:path(${HOST_AGNOSTIC}.+)/`,
      destination: `${CANONICAL_ORIGIN}/:path`,
      statusCode: 301 as const,
      has: aliasHost,
    },
    {
      source: `/:path(${HOST_AGNOSTIC}.*)`,
      destination: `${CANONICAL_ORIGIN}/:path`,
      statusCode: 301 as const,
      has: aliasHost,
    },
    // Replaces Next's built-in 308 trailing-slash redirect (skipTrailingSlashRedirect below)
    // so a slash variant is one 301 and never a 308 followed by a 301.
    {
      source: "/:path((?!\\.well-known(?:/.*)?)(?:[^/]+/)*[^/]+)/",
      destination: "/:path",
      statusCode: 301 as const,
    },
  ];
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  ...(isDemoExport
    ? {
        output: "export" as const,
        basePath: demoBasePath,
        // GitHub Pages resolves /calculators/ to calculators/index.html.
        trailingSlash: true,
      }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
        // Trailing slashes are handled by the explicit 301 rules in siteRedirects().
        skipTrailingSlashRedirect: true,
        async redirects() {
          return siteRedirects();
        },
      }),
};

export default nextConfig;
