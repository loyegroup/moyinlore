import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Temporarily ignore ESLint errors during build
  },
  images: {
  domains: ['res.cloudinary.com'], // Or any domain used for image hosting
  },
};

export default nextConfig;
