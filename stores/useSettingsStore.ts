"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { resolveAppLanguage } from "@/lib/i18n/languages";
import type { AppLanguage, AppTheme } from "@/lib/types";

type SettingsState = {
  theme: AppTheme;
  language: AppLanguage;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      language: "ru",
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "angle-settings",
      merge: (persisted, current) => {
        const saved = persisted as Partial<SettingsState> | undefined;
        return {
          ...current,
          ...saved,
          language: resolveAppLanguage(saved?.language),
        };
      },
    }
  )
);
