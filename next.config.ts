import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack bundler — disable Turbopack completely
  turbopack: false,
} as NextConfig;

export default nextConfig;
