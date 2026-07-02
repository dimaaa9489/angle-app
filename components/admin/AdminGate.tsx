"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/components/AuthProvider";
import { signInWithGoogle } from "@/lib/auth";
import { getAccessToken } from "@/lib/admin-api";

type AdminGateState =
  | { kind: "loading" }
  | { kind: "guest" }
  | { kind: "forbidden"; email: string; configured: boolean }
  | { kind: "ready"; email: string };

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [gate, setGate] = useState<AdminGateState>({ kind: "loading" });

  useEffect(() => {
    const check = async () => {
      if (isLoading) return;
      if (!user) {
        setGate({ kind: "guest" });
        return;
      }

      const token = await getAccessToken();
      if (!token) {
        setGate({ kind: "guest" });
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.isAdmin) {
        setGate({
          kind: "forbidden",
          email: data.email ?? user.email ?? "",
          configured: Boolean(data.configured),
        });
        return;
      }

      setGate({ kind: "ready", email: data.email ?? user.email ?? "" });
    };

    void check();
  }, [isLoading, user]);

  if (gate.kind === "loading" || isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
        Проверка доступа…
      </div>
    );
  }

  if (gate.kind === "guest") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg font-bold text-white">Вход для администратора</p>
        <p className="mt-2 text-sm text-white/55">
          Войдите через Google — email должен быть в списке ADMIN_EMAILS на Vercel.
        </p>
        <button
          type="button"
          onClick={() => void signInWithGoogle("/admin")}
          className="mt-5 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#2F251D] active:scale-[0.98]"
        >
          Войти через Google
        </button>
      </div>
    );
  }

  if (gate.kind === "forbidden") {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
        <p className="text-lg font-bold text-white">Нет доступа</p>
        <p className="mt-2 text-sm text-white/70">
          {gate.email} не в списке администраторов.
        </p>
        {!gate.configured ? (
          <p className="mt-3 text-xs text-amber-200/80">
            На Vercel не задана переменная ADMIN_EMAILS — добавь свой email и передеплой.
          </p>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
