/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@packages", "@shared"],
  experimental: {
    serverActions: true,
  },
  swcMinify: true,
};

module.exports = nextConfig;
