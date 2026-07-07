import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { resolvePoseImageUrl } from "@/lib/pose-image-url";
import { getR2Config } from "@/lib/r2-config";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    getR2Config();
  } catch (error) {
    const message = error instanceof Error ? error.message : "R2 not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("poses").select("id, image_url, image_key");

    if (error) throw error;

    let repaired = 0;
    for (const row of data ?? []) {
      const imageKey = row.image_key ? String(row.image_key) : null;
      const fixed = resolvePoseImageUrl(String(row.image_url), imageKey);
      if (fixed === row.image_url || !fixed.startsWith("http")) continue;

      const { error: updateError } = await supabase
        .from("poses")
        .update({ image_url: fixed })
        .eq("id", row.id);

      if (!updateError) repaired += 1;
    }

    return NextResponse.json({ repaired, total: data?.length ?? 0 });
  } catch (error) {
    console.error("[admin repair-images]", error);
    return NextResponse.json({ error: "Failed to repair image URLs" }, { status: 500 });
  }
}
