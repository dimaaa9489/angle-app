import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : "standalone",
  images: { unoptimized: true },
  trailingSlash: isCapacitorBuild ? true : undefined,
  // Доступ с телефона по локальному IP в dev
  allowedDevOrigins: ["192.168.100.7", "localhost", "127.0.0.1"],
};

export default nextConfig;
