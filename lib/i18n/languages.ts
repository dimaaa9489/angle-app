import type { AppLanguage } from "@/lib/types";

export const APP_LANGUAGES = [
  { value: "ru" as const, label: "Русский", nativeLabel: "Русский" },
  { value: "en" as const, label: "English", nativeLabel: "English" },
  { value: "uk" as const, label: "Ukrainian", nativeLabel: "Українська" },
  { value: "de" as const, label: "German", nativeLabel: "Deutsch" },
  { value: "fr" as const, label: "French", nativeLabel: "Français" },
  { value: "es" as const, label: "Spanish", nativeLabel: "Español" },
  { value: "it" as const, label: "Italian", nativeLabel: "Italiano" },
  { value: "pt" as const, label: "Portuguese", nativeLabel: "Português" },
  { value: "pl" as const, label: "Polish", nativeLabel: "Polski" },
  { value: "tr" as const, label: "Turkish", nativeLabel: "Türkçe" },
  { value: "nl" as const, label: "Dutch", nativeLabel: "Nederlands" },
  { value: "cs" as const, label: "Czech", nativeLabel: "Čeština" },
  { value: "zh" as const, label: "Chinese", nativeLabel: "中文" },
  { value: "ja" as const, label: "Japanese", nativeLabel: "日本語" },
  { value: "ko" as const, label: "Korean", nativeLabel: "한국어" },
  { value: "ar" as const, label: "Arabic", nativeLabel: "العربية" },
  { value: "hi" as const, label: "Hindi", nativeLabel: "हिन्दी" },
  { value: "id" as const, label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
] satisfies { value: AppLanguage; label: string; nativeLabel: string }[];

export const DEFAULT_LANGUAGE: AppLanguage = "ru";

export function isAppLanguage(value: string): value is AppLanguage {
  return APP_LANGUAGES.some((lang) => lang.value === value);
}

export function resolveAppLanguage(value: string | undefined): AppLanguage {
  if (value && isAppLanguage(value)) return value;
  return DEFAULT_LANGUAGE;
}
