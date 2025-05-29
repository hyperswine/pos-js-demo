/** @type {import('next').NextConfig} */

// Determine if we're building for GitHub Pages
const isGithubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Only add basePath when building for GitHub Pages
  ...(isGithubPages && {
    basePath: '/pos-js-demo',
    assetPrefix: '/pos-js-demo/'
  })
};

export default nextConfig;
