export function parseRgbString(rgb: string): [number, number, number] {
  const [r, g, b] = rgb.split(",").map((part) => Number.parseInt(part.trim(), 10));
  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return [248, 248, 248];
  }
  return [r, g, b];
}

export function formatRgbString(r: number, g: number, b: number): string {
  return `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
}

export function lerpRgbString(from: string, to: string, t: number): string {
  const [r1, g1, b1] = parseRgbString(from);
  const [r2, g2, b2] = parseRgbString(to);
  const mix = Math.min(1, Math.max(0, t));
  return formatRgbString(
    r1 + (r2 - r1) * mix,
    g1 + (g2 - g1) * mix,
    b1 + (b2 - b1) * mix
  );
}

export function rgbDistance(a: string, b: string): number {
  const [r1, g1, b1] = parseRgbString(a);
  const [r2, g2, b2] = parseRgbString(b);
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}

export function isDarkTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function getDynamicBgNeutral(): number {
  return isDarkTheme() ? 20 : 248;
}

/** Light touch — keep the gradient close to the card color. */
export function softenRgb(rgb: string, amount?: number): string {
  const [r, g, b] = parseRgbString(rgb);
  const neutral = getDynamicBgNeutral();
  const mix = amount ?? (isDarkTheme() ? 0.03 : 0.02);
  return formatRgbString(
    r + (neutral - r) * mix,
    g + (neutral - g) * mix,
    b + (neutral - b) * mix
  );
}
