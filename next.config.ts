import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions already default on in Next 14
  },
  images: {
    domains: [],
  },
};

export default nextConfig;
