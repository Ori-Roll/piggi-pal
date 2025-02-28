import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    //@ts-expect-error - This is an experimental feature in next.js (as of now: next-canary) and is not yet in the types
    nodeMiddleware: true,
  },
};

export default nextConfig;
