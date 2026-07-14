"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Crown, Globe, Moon, Shield } from "lucide-react";

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
    <div className="angle-settings-row">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="text-[var(--text-secondary)]">{icon}</span>
        <span className="text-[14px] font-semibold">{label}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function getInitials(firstName: string | null, email: string | undefined) {
  if (firstName?.trim()) {
    return firstName.trim().slice(0, 1).toUpperCase();
  }
  if (email?.trim()) {
    return email.trim().slice(0, 1).toUpperCase();
  }
  return "?";
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

  const initials = getInitials(firstName, user?.email);

  return (
    <div className="angle-ui-shell">
      <GlassCard padding="md">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] text-lg font-bold">
            {initials}
          </div>
          <h1 className="text-[20px] font-bold">{t("profileTitle")}</h1>
          <p className="mt-1 text-[14px] font-semibold">{getGreeting(firstName, language)}</p>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            {user?.email ?? t("profileSignInHint")}
          </p>
        </div>

        {!user ? (
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="angle-btn-primary mb-5 w-full py-2.5 text-[14px]"
          >
            {t("profileSignInGoogle")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="angle-btn-secondary mb-5 w-full py-2.5 text-[14px]"
          >
            {t("profileSignOut")}
          </button>
        )}

        <div className="angle-settings-panel">
          <SettingRow icon={<Moon size={16} />} label={t("profileTheme")}>
            <SettingSelect<AppTheme>
              ariaLabel={t("profileSelectTheme")}
              value={theme}
              options={themeOptions}
              onChange={setTheme}
            />
          </SettingRow>

          <SettingRow icon={<Globe size={16} />} label={t("profileLanguage")}>
            <SettingSelect
              ariaLabel={t("profileSelectLanguage")}
              value={language}
              options={LANGUAGE_OPTIONS}
              onChange={setLanguage}
            />
          </SettingRow>

          <SettingRow icon={<Crown size={16} />} label={t("profileSubscription")}>
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
              {t("profileSubscriptionSoon")}
            </span>
          </SettingRow>

          <SettingRow icon={<Shield size={16} />} label={t("profilePrivacy")}>
            <Link href="/privacy" className="text-[13px] font-bold text-[var(--text-secondary)]">
              {t("profileOpen")}
            </Link>
          </SettingRow>
        </div>
      </GlassCard>
    </div>
  );
}
