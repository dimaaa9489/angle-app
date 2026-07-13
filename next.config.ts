import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === "1";

const devLanOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : "standalone",
  images: { unoptimized: true },
  trailingSlash: isCapacitorBuild ? true : undefined,
  // Phone on LAN: origins are injected by `npm run dev` (scripts/dev-network.mjs)
  allowedDevOrigins: ["localhost", "127.0.0.1", ...devLanOrigins],
};

export default nextConfig;
