"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Crown, Globe, Moon } from "lucide-react";

import { getGreeting, useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/GlassCard";
import { SettingSelect } from "@/components/SettingSelect";
import { useTranslation } from "@/hooks/useTranslation";
import { signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { APP_LANGUAGES } from "@/lib/i18n/languages";
import type { AppTheme } from "@/lib/types";
import { useSettingsStore } from "@/stores/useSettingsStore";

const LANGUAGE_OPTIONS = APP_LANGUAGES.map((lang) => ({
  value: lang.value,
  label: lang.nativeLabel,
}));

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
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-3.5 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-[var(--text-secondary)]">{icon}</span>
        <span className="text-[15px] font-semibold">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, firstName } = useAuth();
  const { t, language } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const themeOptions = useMemo(
    () => [
      { value: "light" as const, label: t("profileThemeLight") },
      { value: "dark" as const, label: t("profileThemeDark") },
      { value: "system" as const, label: t("profileThemeSystem") },
    ],
    [t]
  );

  return (
    <GlassCard padding="md">
      <h1 className="text-[26px] font-bold">{t("profileTitle")}</h1>
      <p className="mt-2 text-lg font-semibold">{getGreeting(firstName, language)}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {user?.email ?? t("profileSignInHint")}
      </p>

      {!user ? (
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="angle-btn-primary mt-5 w-full py-3.5 text-[15px]"
        >
          {t("profileSignInGoogle")}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="angle-btn-secondary mt-5 w-full py-3.5 text-[15px]"
        >
          {t("profileSignOut")}
        </button>
      )}

      <div className="mt-6">
        <SettingRow icon={<Moon size={18} />} label={t("profileTheme")}>
          <SettingSelect<AppTheme>
            ariaLabel={t("profileSelectTheme")}
            value={theme}
            options={themeOptions}
            onChange={setTheme}
          />
        </SettingRow>

        <SettingRow icon={<Globe size={18} />} label={t("profileLanguage")}>
          <SettingSelect
            ariaLabel={t("profileSelectLanguage")}
            value={language}
            options={LANGUAGE_OPTIONS}
            onChange={setLanguage}
          />
        </SettingRow>

        <SettingRow icon={<Crown size={18} />} label={t("profileSubscription")}>
          <span className="text-xs font-semibold text-[var(--text-tertiary)]">
            {t("profileSubscriptionSoon")}
          </span>
        </SettingRow>

        <SettingRow icon={<Moon size={18} />} label={t("profilePrivacy")}>
          <Link href="/privacy" className="text-sm font-bold text-[var(--text-secondary)]">
            {t("profileOpen")}
          </Link>
        </SettingRow>
      </div>
    </GlassCard>
  );
}
