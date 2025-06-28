// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration to ignore TypeScript errors during production builds.
  // !! WARN !!
  // This is DANGEROUS and should only be used as a temporary measure.
  // It allows your project to deploy even if it has type errors, which
  // can lead to runtime issues in production.
  // Always aim to fix TypeScript errors rather than ignoring them.
  // !! WARN !!
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuration to ignore ESLint errors during production builds.
  // !! WARN !!
  // Similar to TypeScript errors, ignoring ESLint warnings/errors can
  // lead to less maintainable code and potential bugs.
  // Use this temporarily and prioritize fixing linting issues.
  // !! WARN !!
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configuration for Next.js Image Optimization
  images: {
    // List of allowed domains for external images.
    // Next.js will only optimize images from these domains.
    // Ensure all domains hosting your images are listed here.
    domains: ['res.cloudinary.com'],
  },

  // ... other Next.js configurations can go here
  // For example, webpack configurations, redirects, headers, etc.
};

module.exports = nextConfig;
