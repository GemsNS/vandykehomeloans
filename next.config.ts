import type { NextConfig } from "next";

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
const NAF_PREQUAL_URL = "https://www.newamericanfunding.com/lps/prequal/anthonyvandyke/";

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

function siteRedirects() {
  const aliasHost = [{ type: "host" as const, value: ALIAS_HOSTS }];
  return [
    // Off-site hand-off stays a temporary 307 so browsers never cache it permanently.
    { source: "/apply", destination: NAF_PREQUAL_URL, permanent: false },
    // Old URLs on an alias host go straight to their final canonical URL (one hop, not two).
    ...MOVED_PAGES.map(({ source, destination }) => ({
      source,
      destination: `${CANONICAL_ORIGIN}${destination}`,
      statusCode: 301 as const,
      has: aliasHost,
    })),
    ...MOVED_PAGES.map(({ source, destination }) => ({
      source,
      destination,
      statusCode: 301 as const,
    })),
    // Everything else on an alias host moves to vandyke.loans, except the cron API, the
    // admin portal and build assets, which keep answering on whichever host they were called.
    {
      source: "/:path((?!api(?:/|$)|admin(?:/|$)|_next(?:/|$)).*)",
      destination: `${CANONICAL_ORIGIN}/:path`,
      statusCode: 301 as const,
      has: aliasHost,
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
        async redirects() {
          return siteRedirects();
        },
      }),
};

export default nextConfig;
