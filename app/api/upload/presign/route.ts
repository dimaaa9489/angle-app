import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { createPresignedUploadUrl } from "@/lib/r2-server";

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = String(body.filename ?? "pose.jpg");
    const contentType = String(body.contentType ?? "image/jpeg");
    const result = await createPresignedUploadUrl(filename, contentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[presign]", error);
    const message = error instanceof Error ? error.message : "Presign failed";
    const hint = message.startsWith("Missing env:")
      ? `На Vercel не заданы переменные R2. Добавь ${message.replace("Missing env: ", "")} в Settings → Environment Variables.`
      : message;
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
