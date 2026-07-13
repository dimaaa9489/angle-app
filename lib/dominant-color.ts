import { isAllowedFeedImageUrl, getFeedImageSrc } from "@/lib/feed-image";

const DEFAULT_RGB = "248,248,248";
const colorCache = new Map<string, string>();

async function extractViaApi(imageUrl: string): Promise<string | null> {
  if (!isAllowedFeedImageUrl(imageUrl)) return null;

  try {
    const response = await fetch(
      `/api/dominant-color?src=${encodeURIComponent(imageUrl)}`
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { rgb?: string };
    return data.rgb ?? null;
  } catch {
    return null;
  }
}

async function extractViaCanvas(proxiedUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 36;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(DEFAULT_RGB);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 32) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }

        if (!count) {
          resolve(DEFAULT_RGB);
          return;
        }

        resolve(`${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)}`);
      } catch {
        resolve(DEFAULT_RGB);
      }
    };

    img.onerror = () => resolve(DEFAULT_RGB);
    img.src = proxiedUrl;
  });
}

/** Pass the original pose `imageUrl`. */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  const cached = colorCache.get(imageUrl);
  if (cached) return cached;

  const fromApi = await extractViaApi(imageUrl);
  if (fromApi) {
    colorCache.set(imageUrl, fromApi);
    return fromApi;
  }

  const proxied = getFeedImageSrc(imageUrl);
  const fromCanvas = await extractViaCanvas(proxied);
  colorCache.set(imageUrl, fromCanvas);
  return fromCanvas;
}

export async function extractDominantColorFromProxy(
  imageUrl: string,
  proxiedUrl: string
): Promise<string> {
  const fromApi = await extractViaApi(imageUrl);
  if (fromApi) {
    colorCache.set(imageUrl, fromApi);
    return fromApi;
  }

  const fromCanvas = await extractViaCanvas(proxiedUrl);
  colorCache.set(imageUrl, fromCanvas);
  return fromCanvas;
}
