import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@arys-rx/api-client', '@arys-rx/types'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
};

export default nextConfig;
