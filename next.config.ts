import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
