"use client";

import { useEffect } from "react";

import { resolveAppLanguage } from "@/lib/i18n/languages";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    const resolved = resolveAppLanguage(language);
    document.documentElement.lang = resolved;
  }, [language]);

  return children;
}
