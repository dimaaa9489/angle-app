import { APP_LANGUAGES } from "@/lib/i18n/languages";
import type { AppLanguage } from "@/lib/types";

/** DeepL API language codes (target + source). */
const DEEPL_LANG: Partial<Record<AppLanguage, string>> = {
  ru: "RU",
  en: "EN",
  uk: "UK",
  de: "DE",
  fr: "FR",
  es: "ES",
  it: "IT",
  pt: "PT-PT",
  pl: "PL",
  tr: "TR",
  nl: "NL",
  cs: "CS",
  zh: "ZH",
  ja: "JA",
  ko: "KO",
  ar: "AR",
  id: "ID",
  // Hindi is not supported by DeepL — covered by static search expansion only.
};

/** Fallback codes for LibreTranslate when DeepL is unavailable. */
const LIBRE_LANG: Record<AppLanguage, string> = {
  ru: "ru",
  en: "en",
  uk: "uk",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  pt: "pt",
  pl: "pl",
  tr: "tr",
  nl: "nl",
  cs: "cs",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  ar: "ar",
  hi: "hi",
  id: "id",
};

export type TranslateProvider = "deepl" | "libretranslate" | "none";

function getDeepLKey() {
  return process.env.DEEPL_API_KEY?.trim() || "";
}

function getLibreUrl() {
  return (
    process.env.LIBRETRANSLATE_URL?.trim() || "https://libretranslate.com"
  ).replace(/\/$/, "");
}

function getLibreKey() {
  return process.env.LIBRETRANSLATE_API_KEY?.trim() || "";
}

export function getTranslateProvider(): TranslateProvider {
  if (getDeepLKey()) return "deepl";
  if (getLibreKey()) return "libretranslate";
  return "none";
}

export function isMachineTranslationConfigured(): boolean {
  return getTranslateProvider() !== "none";
}

function getDeepLBaseUrl(key: string) {
  return key.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";
}

async function translateDeepL(
  text: string,
  target: string,
  source?: string
): Promise<string> {
  const key = getDeepLKey();
  const body = new URLSearchParams({
    text,
    target_lang: target,
  });
  if (source) body.set("source_lang", source);

  const response = await fetch(`${getDeepLBaseUrl(key)}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`DeepL failed: ${response.status} ${detail}`);
  }

  const data = (await response.json()) as {
    translations?: { text?: string }[];
  };
  const translated = data.translations?.[0]?.text?.trim();
  if (!translated) throw new Error("DeepL returned empty text");
  return translated;
}

async function translateLibre(
  text: string,
  target: string,
  source?: string
): Promise<string> {
  const apiKey = getLibreKey();
  const payload: Record<string, string> = {
    q: text,
    source: source || "auto",
    target,
    format: "text",
  };
  if (apiKey) payload.api_key = apiKey;

  const response = await fetch(`${getLibreUrl()}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate failed: ${response.status}`);
  }

  const data = (await response.json()) as { translatedText?: string };
  const translated = data.translatedText?.trim();
  if (!translated) throw new Error("LibreTranslate returned empty text");
  return translated;
}

async function translateToTarget(
  text: string,
  lang: AppLanguage,
  provider: TranslateProvider,
  sourceLang?: AppLanguage
): Promise<string | null> {
  if (!text.trim()) return null;

  try {
    if (provider === "deepl") {
      const target = DEEPL_LANG[lang];
      if (!target) return null;
      const source = sourceLang ? DEEPL_LANG[sourceLang] : undefined;
      return await translateDeepL(text, target, source);
    }
    if (provider === "libretranslate") {
      const source = sourceLang ? LIBRE_LANG[sourceLang] : undefined;
      return await translateLibre(text, LIBRE_LANG[lang], source);
    }
  } catch (error) {
    console.warn(`[translate] ${provider} → ${lang}:`, error);
  }

  return null;
}

/** Translates text into all 18 app languages (best effort). */
export async function translateTextToAllLanguages(
  text: string,
  options?: { sourceLang?: AppLanguage }
): Promise<Partial<Record<AppLanguage, string>>> {
  const trimmed = text.trim();
  if (!trimmed) return {};

  const provider = getTranslateProvider();
  if (provider === "none") return {};

  const results: Partial<Record<AppLanguage, string>> = {};
  const targets = APP_LANGUAGES.map((lang) => lang.value);

  await Promise.all(
    targets.map(async (lang) => {
      const translated = await translateToTarget(
        trimmed,
        lang,
        provider,
        options?.sourceLang
      );
      if (translated) results[lang] = translated;
    })
  );

  return results;
}

const SEARCH_PIVOT_LANGUAGES: AppLanguage[] = ["en", "ru"];

/** Fast query expansion: translate to English + Russian only (2 API calls max). */
export async function translateToPivotLanguages(text: string): Promise<string[]> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const provider = getTranslateProvider();
  if (provider === "none") return [];

  const results: string[] = [];

  await Promise.all(
    SEARCH_PIVOT_LANGUAGES.map(async (lang) => {
      const translated = await translateToTarget(trimmed, lang, provider);
      if (translated) results.push(translated);
    })
  );

  return results;
}
