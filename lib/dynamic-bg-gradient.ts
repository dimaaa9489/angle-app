import { isDarkTheme } from "@/lib/color-utils";

export function buildDynamicBgGradient(rgb: string): string {
  const dark = isDarkTheme();
  const topGlow = dark ? 0.92 : 0.82;
  const midGlow = dark ? 0.55 : 0.48;
  const bottomGlow = dark ? 0.4 : 0.34;

  return `
    radial-gradient(ellipse 150% 85% at 50% -4%, rgba(${rgb}, ${topGlow}), transparent 62%),
    radial-gradient(ellipse 115% 72% at 50% 48%, rgba(${rgb}, ${midGlow}), transparent 68%),
    radial-gradient(ellipse 95% 52% at 50% 100%, rgba(${rgb}, ${bottomGlow}), transparent 66%)
  `;
}

export const DYNAMIC_BG_FADE_MS = 1400;
