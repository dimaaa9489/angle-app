import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { resolvePoseImageUrl } from "@/lib/pose-image-url";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Pose } from "@/lib/types";

function rowToPose(row: Record<string, unknown>): Pose {
  const imageKey = row.image_key ? String(row.image_key) : undefined;
  return {
    id: String(row.id),
    imageUrl: resolvePoseImageUrl(String(row.image_url), imageKey),
    imageKey,
    title: String(row.title ?? ""),
    keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
    category: row.category as Pose["category"],
    shotType: row.shot_type as Pose["shotType"],
    locations: (row.locations as Pose["locations"]) ?? [],
    peopleCount: (row.people_count as Pose["peopleCount"]) ?? [],
    sessionTypes: (row.session_types as Pose["sessionTypes"]) ?? [],
    styles: (row.styles as Pose["styles"]) ?? [],
    createdAt: String(row.created_at ?? ""),
  };
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);

    if (error) throw error;
    return NextResponse.json({
      poses: (data ?? []).map((row) => rowToPose(row as Record<string, unknown>)),
    });
  } catch (error) {
    console.error("[admin poses list]", error);
    return NextResponse.json({ error: "Failed to load poses" }, { status: 500 });
  }
}

type CreatePoseBody = {
  imageUrl: string;
  imageKey?: string;
  title: string;
  keywords: string[];
  category: Pose["category"];
  shotType: Pose["shotType"];
  locations?: Pose["locations"];
  peopleCount?: Pose["peopleCount"];
  sessionTypes?: Pose["sessionTypes"];
  styles?: Pose["styles"];
};

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreatePoseBody;
    if (!body.imageUrl || !body.title?.trim()) {
      return NextResponse.json({ error: "imageUrl and title are required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("poses")
      .insert({
        image_url: body.imageUrl,
        image_key: body.imageKey ?? null,
        title: body.title.trim(),
        keywords: body.keywords ?? [],
        category: body.category ?? "women",
        shot_type: body.shotType ?? "portrait",
        locations: body.locations ?? [],
        people_count: body.peopleCount ?? [],
        session_types: body.sessionTypes ?? [],
        styles: body.styles ?? [],
        is_published: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ pose: rowToPose(data as Record<string, unknown>) });
  } catch (error) {
    console.error("[admin poses create]", error);
    return NextResponse.json({ error: "Failed to create pose" }, { status: 500 });
  }
}
