import { Capacitor } from "@capacitor/core";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://angle-app.vercel.app";

/** API base URL: production on native APK, current origin in browser */
export function getApiBase(): string {
  if (typeof window === "undefined") return SITE_URL;
  if (Capacitor.isNativePlatform()) return SITE_URL;
  return window.location.origin;
}
