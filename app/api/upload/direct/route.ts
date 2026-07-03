import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { uploadBufferToR2 } from "@/lib/r2-server";
import { resolveImageContentType, validatePoseImage } from "@/lib/upload-limits";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    const validation = validatePoseImage(file);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const contentType = resolveImageContentType(file);
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBufferToR2(buffer, file.name, contentType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[upload/direct]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
