"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "@/lib/admin-api";

type AdminStatus = {
  ready: boolean;
  r2: { configured: boolean; missing: string[] };
  supabase: { url: boolean; anonKey: boolean; serviceRole: boolean };
  adminEmailsConfigured: boolean;
};

export function AdminConfigBanner() {
  const [status, setStatus] = useState<AdminStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    void adminFetch("/api/admin/status")
      .then((data) => {
        if (!cancelled) setStatus(data as AdminStatus);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status || status.ready) return null;

  const missing: string[] = [];
  if (!status.r2.configured) missing.push(...status.r2.missing);
  if (!status.supabase.serviceRole) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  return (
    <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
      <p className="font-bold">Сервер не настроен для загрузки</p>
      <p className="mt-1 text-amber-100/80">
        Добавь на Vercel → angle-app → Settings → Environment Variables (Production):
      </p>
      <ul className="mt-2 list-inside list-disc text-xs text-amber-100/70">
        {missing.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-amber-100/60">
        R2-ключи можно взять из Cloudflare Dashboard → R2 (тот же бакет, что у DotMap, подойдёт).
        После добавления — Redeploy.
      </p>
    </div>
  );
}
