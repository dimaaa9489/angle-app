import { MOCK_POSES } from "@/lib/mock-poses";
import { supabase } from "@/lib/supabase";
import type { Pose } from "@/lib/types";

function rowToPose(row: Record<string, unknown>): Pose {
  return {
    id: String(row.id),
    imageUrl: String(row.image_url),
    imageKey: row.image_key ? String(row.image_key) : undefined,
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

export async function fetchPoses(): Promise<Pose[]> {
  try {
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) return MOCK_POSES;
    return data.map((row) => rowToPose(row as Record<string, unknown>));
  } catch {
    return MOCK_POSES;
  }
}

/** Только для бесконечной ленты на главной */
export async function fetchPosesPage(
  offset: number,
  limit = 12
): Promise<{ poses: Pose[]; hasMore: boolean }> {
  try {
    const { data, error, count } = await supabase
      .from("poses")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !data?.length) {
      return getMockPosesPage(offset, limit);
    }

    const poses = data.map((row) => rowToPose(row as Record<string, unknown>));
    const total = count ?? poses.length;
    return { poses, hasMore: offset + poses.length < total };
  } catch {
    return getMockPosesPage(offset, limit);
  }
}

function getMockPosesPage(offset: number, limit: number) {
  if (!MOCK_POSES.length) {
    return { poses: [], hasMore: false };
  }

  const poses = Array.from({ length: limit }, (_, index) => {
    const source = MOCK_POSES[(offset + index) % MOCK_POSES.length];
    return source;
  });

  return { poses, hasMore: offset + limit < 240 };
}

export async function fetchPoseById(id: string): Promise<Pose | null> {
  try {
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return MOCK_POSES.find((p) => p.id === id) ?? null;
    }
    return rowToPose(data as Record<string, unknown>);
  } catch {
    return MOCK_POSES.find((p) => p.id === id) ?? null;
  }
}

export async function createPoseRecord(pose: Omit<Pose, "id" | "createdAt">) {
  const { data, error } = await supabase
    .from("poses")
    .insert({
      image_url: pose.imageUrl,
      image_key: pose.imageKey,
      title: pose.title,
      keywords: pose.keywords,
      category: pose.category,
      shot_type: pose.shotType,
      locations: pose.locations,
      people_count: pose.peopleCount,
      session_types: pose.sessionTypes,
      styles: pose.styles,
      is_published: true,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToPose(data as Record<string, unknown>);
}
