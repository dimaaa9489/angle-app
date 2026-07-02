import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin(_request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("poses").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin poses delete]", error);
    return NextResponse.json({ error: "Failed to delete pose" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("poses")
      .update({ is_published: Boolean(body.isPublished) })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin poses patch]", error);
    return NextResponse.json({ error: "Failed to update pose" }, { status: 500 });
  }
}
