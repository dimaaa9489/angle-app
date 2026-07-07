const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
]);

/** Vercel serverless body limit is ~4.5 MB — client normalizes to JPEG before upload */
export const MAX_POSE_IMAGE_SIZE = 4.5 * 1024 * 1024;

export function validatePoseImage(file: File): { ok: true } | { ok: false; error: string } {
  if (!file.type.startsWith("image/") && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(ext)) {
      return { ok: false, error: "Только изображения (JPG, PNG, WebP…)" };
    }
  }

  if (file.size > MAX_POSE_IMAGE_SIZE) {
    return {
      ok: false,
      error: "Файл больше 4.5 МБ — перезагрузи страницу и попробуй снова (фото сожмутся автоматически)",
    };
  }

  return { ok: true };
}

export function resolveImageContentType(file: File): string {
  if (file.type && ALLOWED_IMAGE_TYPES.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}
