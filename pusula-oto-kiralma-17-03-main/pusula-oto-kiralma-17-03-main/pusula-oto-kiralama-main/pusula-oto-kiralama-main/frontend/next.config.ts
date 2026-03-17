import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.paratic.com' },
      { protocol: 'https', hostname: 'cdn.motor1.com' },
      { protocol: 'https', hostname: 'www.toyota.com.tr' },
      { protocol: 'https', hostname: 'www.hyundai.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.peugeot.com.tr' },
      { protocol: 'https', hostname: 'www.ford.com.tr' },
      { protocol: 'https', hostname: 'www.honda.com.tr' },
      { protocol: 'https', hostname: 'images.pexels.com' }, // existing or potential
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
