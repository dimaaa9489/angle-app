function getR2PublicBase(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL;
  if (!raw) return undefined;

  const trimmed = raw.replace(/\/$/, "");
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  return trimmed;
}

function encodeR2Key(key: string) {
  return key.split("/").map(encodeURIComponent).join("/");
}

/** Fix broken image_url values saved without https:// base (e.g. wrong R2_PUBLIC_URL on Vercel). */
export function resolvePoseImageUrl(imageUrl: string, imageKey?: string | null): string {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const base = getR2PublicBase();
  const key =
    imageKey?.trim() ||
    (imageUrl.includes("poses/") ? imageUrl.slice(imageUrl.indexOf("poses/")) : null);

  if (base && key) {
    return `${base}/${encodeR2Key(key)}`;
  }

  return imageUrl;
}
