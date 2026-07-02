import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createPresignedUploadUrl } from "@/lib/r2-server";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

async function isAdmin(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  const supabase = getAdminClient();
  const { data } = await supabase.auth.getUser(token);
  if (!data.user?.email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.length) return true;
  return admins.includes(data.user.email.toLowerCase());
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = String(body.filename ?? "pose.jpg");
    const contentType = String(body.contentType ?? "image/jpeg");
    const result = await createPresignedUploadUrl(filename, contentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Presign failed" }, { status: 500 });
  }
}
