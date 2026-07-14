const RETURN_PATH_KEY = "angle:return-path";
const SCROLL_PREFIX = "angle:scroll:";

export function markReturnPath(path?: string) {
  if (typeof window === "undefined") return;
  const next = path ?? `${window.location.pathname}${window.location.search}`;
  sessionStorage.setItem(RETURN_PATH_KEY, next);
}

export function getReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RETURN_PATH_KEY);
}

export function saveScrollForPath(path: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${SCROLL_PREFIX}${path}`, String(window.scrollY));
}

export function readScrollForPath(path: string): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(`${SCROLL_PREFIX}${path}`);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export function restoreScrollForPath(path: string) {
  const y = readScrollForPath(path);
  if (y <= 0) return;

  const apply = () => window.scrollTo(0, y);

  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
}
