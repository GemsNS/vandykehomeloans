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
          return [
            { source: "/programs/va", destination: "/va-loans", permanent: true },
            { source: "/programs/fha", destination: "/fha-loans", permanent: true },
            {
              source: "/programs/self-employed",
              destination: "/self-employed-loans",
              permanent: true,
            },
            {
              source: "/apply",
              destination: "https://www.newamericanfunding.com/lps/prequal/anthonyvandyke/",
              permanent: false,
            },
          ];
        },
      }),
};

export default nextConfig;
