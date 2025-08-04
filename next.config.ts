import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: turn this off when ready for production
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
