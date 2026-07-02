import { Capacitor } from "@capacitor/core";

import { getApiBase } from "@/lib/api-base";
import { supabase } from "@/lib/supabase";

/** Add to Supabase → Authentication → URL Configuration → Redirect URLs */
export const NATIVE_OAUTH_REDIRECT = "com.angle.app://auth/callback";

export const OAUTH_NEXT_KEY = "angle_oauth_next";

export function getOAuthRedirectUrl(): string {
  if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
    return NATIVE_OAUTH_REDIRECT;
  }
  return `${getApiBase()}/auth/callback`;
}

export async function signInWithGoogle(nextPath = "/profile"): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(OAUTH_NEXT_KEY, nextPath);
  }
  const redirectTo = getOAuthRedirectUrl();
  const options = {
    redirectTo,
    queryParams: {
      access_type: "offline",
      prompt: "consent",
    },
  };

  if (Capacitor.isNativePlatform()) {
    const { Browser } = await import("@capacitor/browser");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        ...options,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("OAuth URL not returned");
    await Browser.open({ url: data.url });
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options,
  });
  if (error) throw error;
}
