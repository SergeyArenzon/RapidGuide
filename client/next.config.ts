import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    reactCompiler: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://huddlehub.io/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
