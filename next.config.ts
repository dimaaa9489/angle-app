import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : "standalone",
  images: { unoptimized: true },
  trailingSlash: isCapacitorBuild ? true : undefined,
};

export default nextConfig;
