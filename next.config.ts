import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/programs/va", destination: "/va-loans", permanent: true },
      { source: "/programs/fha", destination: "/fha-loans", permanent: true },
      { source: "/programs/self-employed", destination: "/self-employed-loans", permanent: true },
    ];
  },
};

export default nextConfig;
