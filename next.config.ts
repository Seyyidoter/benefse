import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dsmcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'marketplace-supplier-media-center.oss-eu-central-1.aliyuncs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.trendyol.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
