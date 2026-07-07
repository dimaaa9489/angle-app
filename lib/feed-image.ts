const ALLOWED_HOSTS = [".r2.dev", "images.unsplash.com"];

export function isAllowedFeedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some(
      (host) => parsed.hostname === host.replace(/^\./, "") || parsed.hostname.endsWith(host)
    );
  } catch {
    return false;
  }
}

/** Small JPEG proxy for feed cards — much faster than full-size WebP from R2 */
export function getFeedImageSrc(imageUrl: string, width = 420): string {
  if (!imageUrl.startsWith("https://")) return imageUrl;
  if (!isAllowedFeedImageUrl(imageUrl)) return imageUrl;
  return `/api/feed-image?src=${encodeURIComponent(imageUrl)}&w=${width}`;
}
