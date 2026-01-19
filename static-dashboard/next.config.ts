import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/agy-demo',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
