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
    return NextResponse.json({ error: "Presign failed" }, { status: 500 });
  }
}
