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
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'elazigotokiralamapusula.com' },
      { protocol: 'https', hostname: 'www.elazigotokiralamapusula.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '156.67.27.14' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
