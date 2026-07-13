"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/components/AuthProvider";
import { admin } from "@/components/admin/admin-ui";
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
      <div className={`${admin.card} p-8 text-center text-sm text-[#6b6b6b]`}>
        Проверка доступа…
      </div>
    );
  }

  if (gate.kind === "guest") {
    return (
      <div className={`${admin.card} p-8 text-center`}>
        <p className="text-lg font-bold text-[#111111]">Вход для администратора</p>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          {local
            ? "Войди через Google. Email должен быть в ADMIN_EMAILS в .env.local."
            : "Войди через Google. Email должен быть в ADMIN_EMAILS на сервере."}
        </p>
        <button
          type="button"
          onClick={() => void signInWithGoogle("/admin")}
          className={`${admin.btnPrimary} mt-5 px-6 py-3`}
        >
          Войти через Google
        </button>
      </div>
    );
  }

  if (gate.kind === "forbidden") {
    return (
      <div className="rounded-[var(--radius-md)] border border-[#fecaca] bg-[#fef2f2] p-8 text-center">
        <p className="text-lg font-bold text-[#111111]">Нет доступа</p>
        {!gate.configured ? (
          <>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Не настроен <code>ADMIN_EMAILS</code>
              {local ? " в .env.local" : " на сервере"}.
            </p>
            <p className="mt-3 text-xs text-[#92400e]">
              {local ? (
                <>
                  В файле <code>.env.local</code> добавь:
                  <br />
                  <code>ADMIN_EMAILS=your@email.com</code>
                  <br />
                  Перезапусти dev-сервер.
                </>
              ) : (
                <>Vercel → Environment Variables → ADMIN_EMAILS → Redeploy.</>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Вошёл как <strong>{gate.email}</strong> — email не в списке админов (
              {gate.adminCount}).
            </p>
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
