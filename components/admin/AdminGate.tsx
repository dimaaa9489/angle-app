"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/components/AuthProvider";
import { signInWithGoogle } from "@/lib/auth";
import { getAccessToken } from "@/lib/admin-api";

type AdminGateState =
  | { kind: "loading" }
  | { kind: "guest" }
  | { kind: "forbidden"; email: string; configured: boolean; adminCount: number }
  | { kind: "ready"; email: string };

function isLocalHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.");
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [gate, setGate] = useState<AdminGateState>({ kind: "loading" });
  const local = isLocalHost();

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
          adminCount: Number(data.adminCount ?? 0),
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
          {local
            ? "Войди через Google. Email должен быть в ADMIN_EMAILS в .env.local."
            : "Войди через Google. Email должен быть в ADMIN_EMAILS на сервере."}
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
        {!gate.configured ? (
          <>
            <p className="mt-2 text-sm text-white/70">
              Не настроен <code className="text-white">ADMIN_EMAILS</code>
              {local ? " в .env.local" : " на сервере"}.
            </p>
            <p className="mt-3 text-xs text-amber-200/80">
              {local ? (
                <>
                  В файле <code className="text-amber-100">.env.local</code> добавь строку:
                  <br />
                  <code className="text-amber-100">ADMIN_EMAILS=dimaa9489@gmail.com</code>
                  <br />
                  Сохрани файл и перезапусти dev-сервер: Ctrl+C → <code>npm run dev</code>
                </>
              ) : (
                <>
                  Vercel → angle-app → Environment Variables →{" "}
                  <code className="text-amber-100">ADMIN_EMAILS=dimaa9489@gmail.com</code>
                  <br />
                  Затем Redeploy.
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-white/70">
              Вошёл как <strong>{gate.email}</strong> — этого email нет в списке админов (
              {gate.adminCount}).
            </p>
            <p className="mt-3 text-xs text-amber-200/80">
              {local ? (
                <>
                  Добавь <code className="text-amber-100">{gate.email}</code> в ADMIN_EMAILS в
                  .env.local и перезапусти <code>npm run dev</code>.
                </>
              ) : (
                <>
                  Добавь <code className="text-amber-100">{gate.email}</code> в ADMIN_EMAILS на
                  Vercel и сделай Redeploy.
                </>
              )}
            </p>
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
