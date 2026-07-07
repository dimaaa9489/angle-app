import { NextResponse } from "next/server";
import sharp from "sharp";

import { isAllowedFeedImageUrl } from "@/lib/feed-image";

export const runtime = "nodejs";

const MAX_WIDTH = 640;
const DEFAULT_WIDTH = 420;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  const width = Math.min(
    MAX_WIDTH,
    Math.max(200, Number.parseInt(searchParams.get("w") ?? String(DEFAULT_WIDTH), 10) || DEFAULT_WIDTH)
  );

  if (!src || !isAllowedFeedImageUrl(src)) {
    return NextResponse.json({ error: "Invalid image source" }, { status: 400 });
  }

  try {
    const upstream = await fetch(src, { cache: "force-cache" });
    if (!upstream.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: upstream.status });
    }

    const input = Buffer.from(await upstream.arrayBuffer());
    const output = await sharp(input, { failOn: "none" })
      .rotate()
      .resize(width, undefined, { withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[feed-image]", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
