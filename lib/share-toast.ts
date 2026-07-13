export const SHARE_TOAST_EVENT = "angle-share-toast";

export function showShareToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SHARE_TOAST_EVENT, { detail: { message } })
  );
}
