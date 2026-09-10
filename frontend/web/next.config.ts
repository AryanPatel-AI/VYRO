import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@vyro/shared-types', '@vyro/ai-engine'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },
  // Turbopack monorepo root — required for pnpm workspaces in Next.js 16
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig;
