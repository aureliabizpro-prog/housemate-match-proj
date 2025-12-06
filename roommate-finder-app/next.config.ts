import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/housemate-match-proj',
  assetPrefix: '/housemate-match-proj/',
};

export default nextConfig;
