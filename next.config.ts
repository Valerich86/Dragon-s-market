import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hb.ru-msk.vkcloud-storage.ru', 
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
