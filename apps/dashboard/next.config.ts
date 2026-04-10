import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arys-rx/api-client', '@arys-rx/types'],
};

export default nextConfig;
