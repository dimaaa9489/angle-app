/** Parse "#портрет studio, улица" → ["портрет", "studio", "улица"] */
export function parseHashtags(input: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of input.split(/[\s,]+/)) {
    const tag = raw.replace(/^#+/, "").trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }

  return result;
}

export function formatHashtagPreview(tags: string[]): string {
  return tags.map((tag) => `#${tag}`).join(" ");
}
