import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds (Vercel cache corruption workaround)
  experimental: {
    turbo: {
      resolveExtensions: [],
    },
  },
};

export default nextConfig;
