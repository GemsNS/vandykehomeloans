import type { NextConfig } from "next";

// `npm run build:demo` produces the static GitHub Pages demo at
// https://gemsns.github.io/vandykehomeloans/ — no server, no database.
const isDemoExport = process.env.DEMO_EXPORT === "1";
const demoBasePath = "/vandykehomeloans";

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
        async redirects() {
          return [
            { source: "/programs/va", destination: "/va-loans", permanent: true },
            { source: "/programs/fha", destination: "/fha-loans", permanent: true },
            {
              source: "/programs/self-employed",
              destination: "/self-employed-loans",
              permanent: true,
            },
          ];
        },
      }),
};

export default nextConfig;
