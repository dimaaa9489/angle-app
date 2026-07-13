import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { buildFullPoseKeywords } from "@/lib/pose-search-keywords";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Pose, PoseFilterSelection } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    let updated = 0;
    for (const row of data ?? []) {
      const title = String(row.title ?? "").trim();
      if (!title) continue;

      const selection: PoseFilterSelection = {
        categories: row.category ? [row.category as Pose["category"]] : [],
        shotTypes: row.shot_type ? [row.shot_type as Pose["shotType"]] : [],
        locations: (row.locations as Pose["locations"]) ?? [],
        peopleCount: (row.people_count as Pose["peopleCount"]) ?? [],
        sessionTypes: (row.session_types as Pose["sessionTypes"]) ?? [],
        styles: (row.styles as Pose["styles"]) ?? [],
      };

      const keywords = await buildFullPoseKeywords(selection, title);
      const { error: updateError } = await supabase
        .from("poses")
        .update({ keywords })
        .eq("id", row.id);

      if (!updateError) updated += 1;
    }

    return NextResponse.json({ updated, total: data?.length ?? 0 });
  } catch (error) {
    console.error("[admin reindex-keywords]", error);
    return NextResponse.json({ error: "Failed to reindex keywords" }, { status: 500 });
  }
}
