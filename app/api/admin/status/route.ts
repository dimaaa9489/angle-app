import { NextResponse } from "next/server";

import { getAdminEmails, requireAdmin } from "@/lib/admin-auth";
import { getR2ConfigStatus } from "@/lib/r2-config";

function getSupabaseStatus() {
  return {
    url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const r2 = getR2ConfigStatus();
  const supabase = getSupabaseStatus();
  const admins = getAdminEmails();

  return NextResponse.json({
    ready: r2.configured && supabase.serviceRole,
    r2,
    supabase,
    adminEmailsConfigured: admins.length > 0,
  });
}
