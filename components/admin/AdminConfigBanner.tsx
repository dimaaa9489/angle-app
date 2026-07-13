"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "@/lib/admin-api";
import { admin } from "@/components/admin/admin-ui";

type AdminStatus = {
  ready: boolean;
  r2: { configured: boolean; missing: string[] };
  supabase: { url: boolean; anonKey: boolean; serviceRole: boolean };
  adminEmailsConfigured: boolean;
  translation?: { configured: boolean; provider: string };
};

function isLocalHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.");
}

export function AdminConfigBanner() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const local = isLocalHost();

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

  if (!status) return null;

  const missing: string[] = [];
  if (!status.r2.configured) missing.push(...status.r2.missing);
  if (!status.supabase.serviceRole) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  const showUploadBlock = !status.ready;
  const showTranslationHint = status.ready && !status.translation?.configured;

  if (!showUploadBlock && !showTranslationHint) return null;

  return (
    <div className="mb-6 space-y-3">
      {showUploadBlock ? (
        <div className={admin.warningBanner}>
          <p className="font-bold">Загрузка фото пока недоступна</p>
          <p className="mt-1 opacity-80">
            {local
              ? "Добавь в .env.local и перезапусти npm run dev:"
              : "Добавь на Vercel (Environment Variables) и сделай Redeploy:"}
          </p>
          <ul className="mt-2 list-inside list-disc text-xs opacity-80">
            {missing.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showTranslationHint ? (
        <div className="rounded-[var(--radius-md)] border border-[#bfdbfe] bg-[#eff6ff] p-4 text-sm text-[#1e40af]">
          <p className="font-bold">Поиск на всех языках: добавь DeepL API</p>
          <p className="mt-1 opacity-90">
            {local
              ? "В .env.local: DEEPL_API_KEY=xxx:fx (бесплатный ключ с deepl.com/pro-api)"
              : "На Vercel добавь DEEPL_API_KEY — названия переводятся в keywords при публикации."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
