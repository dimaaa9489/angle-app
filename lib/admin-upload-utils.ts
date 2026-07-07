const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"]);

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext));
}

/** Convert to JPEG before upload — avoids broken WebP in feed and Vercel 4.5MB body limit */
export async function normalizeUploadFile(file: File, maxDimension = 2200): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let quality = 0.88;
    let blob: Blob | null = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", quality);
      });
      if (!blob || blob.size <= 4 * 1024 * 1024) break;
      quality -= 0.1;
    }

    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "pose";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/** Small preview for admin queue — keeps UI responsive with many photos */
export async function createImageThumbnail(file: File, maxSize = 280): Promise<string> {
  if (typeof createImageBitmap !== "function") {
    return URL.createObjectURL(file);
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return URL.createObjectURL(file);
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.8);
    });

    if (!blob) return URL.createObjectURL(file);
    return URL.createObjectURL(blob);
  } catch {
    return URL.createObjectURL(file);
  }
}

export function applyBulkRenameTemplate(
  items: { id: string; title: string; file: File; status: string }[],
  template: string
) {
  let index = 1;
  const trimmed = template.trim() || "Поза {n}";

  return items.map((item) => {
    if (item.status !== "pending") return item;

    const stem = item.file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const title = trimmed
      .replace(/\{n\}/gi, String(index))
      .replace(/\{name\}/gi, stem);
    index += 1;
    return { ...item, title };
  });
}
