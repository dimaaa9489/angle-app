import { NextResponse } from "next/server";
import sharp from "sharp";

import { isAllowedFeedImageUrl } from "@/lib/feed-image";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");

  if (!src || !isAllowedFeedImageUrl(src)) {
    return NextResponse.json({ error: "Invalid image source" }, { status: 400 });
  }

  try {
    const upstream = await fetch(src, { cache: "force-cache" });
    if (!upstream.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: upstream.status });
    }

    const input = Buffer.from(await upstream.arrayBuffer());
    const { dominant } = await sharp(input, { failOn: "none" })
      .rotate()
      .resize(64, 64, { fit: "cover" })
      .stats();

    const rgb = `${dominant.r},${dominant.g},${dominant.b}`;

    return NextResponse.json(
      { rgb },
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    console.error("[dominant-color]", error);
    return NextResponse.json({ error: "Failed to extract color" }, { status: 500 });
  }
}
