"use client";

import Link from "next/link";
import { Crown, Globe, Moon } from "lucide-react";

import { getGreeting, useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/GlassCard";
import { signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useSettingsStore } from "@/stores/useSettingsStore";

function SettingRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3.5 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-white/70">{icon}</span>
        <span className="text-[15px] font-semibold text-white">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, firstName } = useAuth();
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <GlassCard padding="md">
      <h1 className="text-[26px] font-bold text-white">Профиль</h1>
      <p className="mt-2 text-lg font-semibold text-white/90">{getGreeting(firstName)}</p>
      <p className="mt-1 text-sm text-white/50">
        {user?.email ?? "Войдите, чтобы синхронизировать избранное"}
      </p>

      {!user ? (
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="mt-5 w-full rounded-2xl bg-white py-3.5 text-[15px] font-bold text-[#3d2e24] active:scale-[0.98]"
        >
          Войти через Google
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="mt-5 w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 text-[15px] font-bold text-white active:scale-[0.98]"
        >
          Выйти
        </button>
      )}

      <div className="mt-6">
        <SettingRow icon={<Moon size={18} />} label="Тема">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            className="rounded-xl border border-white/15 bg-black/20 px-2 py-1.5 text-sm text-white outline-none"
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
            <option value="system">Системная</option>
          </select>
        </SettingRow>

        <SettingRow icon={<Globe size={18} />} label="Язык">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="rounded-xl border border-white/15 bg-black/20 px-2 py-1.5 text-sm text-white outline-none"
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="uk">Українська</option>
          </select>
        </SettingRow>

        <SettingRow icon={<Crown size={18} />} label="Подписка">
          <span className="text-xs font-semibold text-white/45">Скоро</span>
        </SettingRow>

        <SettingRow icon={<Moon size={18} />} label="Политика">
          <Link href="/privacy" className="text-sm font-bold text-white/80">
            Открыть
          </Link>
        </SettingRow>
      </div>
    </GlassCard>
  );
}
