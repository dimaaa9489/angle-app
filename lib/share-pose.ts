import { Capacitor } from "@capacitor/core";

import { showShareToast } from "@/lib/share-toast";
import { translate } from "@/lib/i18n/ui-messages";
import { getApiBase } from "@/lib/api-base";
import { useSettingsStore } from "@/stores/useSettingsStore";

export type SharePoseResult = "copied" | "failed";

export function getPoseShareUrl(poseId: string): string {
  return `${getApiBase()}/pose?id=${encodeURIComponent(poseId)}`;
}

async function copyToClipboard(text: string) {
  if (Capacitor.isNativePlatform()) {
    const { Clipboard } = await import("@capacitor/clipboard");
    await Clipboard.write({ string: text });
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall back to execCommand below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export async function sharePose({
  poseId,
}: {
  poseId: string;
  title: string;
}): Promise<SharePoseResult> {
  const url = getPoseShareUrl(poseId);

  try {
    await copyToClipboard(url);
    const lang = useSettingsStore.getState().language;
    showShareToast(translate(lang, "shareLinkCopied"));
    return "copied";
  } catch (error) {
    console.warn("[share] clipboard failed:", error);
    const lang = useSettingsStore.getState().language;
    showShareToast(translate(lang, "shareLinkCopyFailed"));
    return "failed";
  }
}
