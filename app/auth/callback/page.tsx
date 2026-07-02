"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { GlassCard } from "@/components/GlassCard";
import { OAUTH_NEXT_KEY } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

function readOAuthError(): string | null {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("error_description") || params.get("error");
  if (fromQuery) {
    return decodeURIComponent(fromQuery.replace(/\+/g, " "));
  }

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const fromHash = hash.get("error_description") || hash.get("error");
  if (fromHash) {
    return decodeURIComponent(fromHash.replace(/\+/g, " "));
  }

  return null;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Завершение входа…");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let subscription: { unsubscribe: () => void } | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const goNext = () => {
      if (timeout) clearTimeout(timeout);
      const next =
        typeof window !== "undefined"
          ? sessionStorage.getItem(OAUTH_NEXT_KEY) || "/profile"
          : "/profile";
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(OAUTH_NEXT_KEY);
      }
      router.replace(next);
    };

    const fail = (message: string) => {
      if (timeout) clearTimeout(timeout);
      setError(message);
    };

    const finish = async () => {
      const oauthError = readOAuthError();
      if (oauthError) {
        fail(oauthError);
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        setStatus("Подтверждение…");
        const {
          data: { session: existing },
        } = await supabase.auth.getSession();
        if (existing) {
          goNext();
          return;
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          fail(exchangeError.message);
          return;
        }
        goNext();
        return;
      }

      if (window.location.hash.includes("access_token")) {
        setStatus("Подтверждение…");
        await new Promise((resolve) => setTimeout(resolve, 400));
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          fail(sessionError.message);
          return;
        }
        if (session) {
          goNext();
          return;
        }
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        fail(sessionError.message);
        return;
      }
      if (session) {
        goNext();
        return;
      }

      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (
          session &&
          (event === "SIGNED_IN" ||
            event === "TOKEN_REFRESHED" ||
            event === "INITIAL_SESSION")
        ) {
          goNext();
        }
      });
      subscription = sub;

      timeout = setTimeout(() => {
        fail("Не удалось завершить вход. Попробуйте снова из профиля.");
      }, 20000);
    };

    void finish();

    return () => {
      subscription?.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <GlassCard padding="md" className="w-full max-w-sm text-center">
        {error ? (
          <p className="text-sm text-red-300">
            {error}.{" "}
            <a href="/profile" className="font-semibold text-white underline">
              Вернуться в профиль
            </a>
          </p>
        ) : (
          <p className="text-sm text-white/60">{status}</p>
        )}
      </GlassCard>
    </main>
  );
}
