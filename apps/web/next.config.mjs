/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vedic-astro/astrology-engine',
    '@vedic-astro/config',
    '@vedic-astro/types',
    '@vedic-astro/ui',
    '@vedic-astro/validation',
  ],
};

export default nextConfig;
