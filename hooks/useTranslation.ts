"use client";

import { useCallback } from "react";

import {
  translate,
  type UiMessageKey,
} from "@/lib/i18n/ui-messages";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);

  const t = useCallback(
    (key: UiMessageKey, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language]
  );

  return { t, language };
}
