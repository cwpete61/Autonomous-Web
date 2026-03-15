const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactStrictMode: true,
  transpilePackages: ['@agency/ui', '@agency/types'],
  experimental: {
    // serverActions is now stable in Next.js 15+
  },
};

module.exports = nextConfig;
