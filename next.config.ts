import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
  },
];

if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_API_URL);
    remotePatterns.push({
      protocol: parsed.protocol.replace(':', '') as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    });
  } catch {
  }
}

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1"],
    remotePatterns,
    unoptimized: true,
  },
};

export default nextConfig;
