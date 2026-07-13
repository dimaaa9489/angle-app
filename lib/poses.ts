import { MOCK_POSES } from "@/lib/mock-poses";
import { shufflePoses } from "@/lib/pose-feed-layout";
import { resolvePoseImageUrl } from "@/lib/pose-image-url";
import { supabase } from "@/lib/supabase";
import type { Pose } from "@/lib/types";

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function shouldUseMocks() {
  return !hasSupabaseConfig() && process.env.NODE_ENV === "development";
}

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

export async function fetchPoses(): Promise<Pose[]> {
  if (shouldUseMocks()) return MOCK_POSES;

  try {
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[poses] fetch failed:", error.message);
      return shouldUseMocks() ? MOCK_POSES : [];
    }
    return (data ?? []).map((row) => rowToPose(row as Record<string, unknown>));
  } catch (error) {
    console.warn("[poses] fetch error:", error);
    return shouldUseMocks() ? MOCK_POSES : [];
  }
}

/** Только для бесконечной ленты на главной */
export async function fetchPosesPage(
  offset: number,
  limit = 12
): Promise<{ poses: Pose[]; hasMore: boolean }> {
  if (shouldUseMocks()) return getMockPosesPage(offset, limit);

  try {
    const { data, error, count } = await supabase
      .from("poses")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.warn("[poses] page failed:", error.message);
      return shouldUseMocks() ? getMockPosesPage(offset, limit) : { poses: [], hasMore: false };
    }

    const poses = (data ?? []).map((row) => rowToPose(row as Record<string, unknown>));
    const total = count ?? poses.length;
    return { poses, hasMore: offset + poses.length < total };
  } catch (error) {
    console.warn("[poses] page error:", error);
    return shouldUseMocks() ? getMockPosesPage(offset, limit) : { poses: [], hasMore: false };
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

/** Random slice for the home feed — new mix on each page visit. */
export async function fetchHomePosesPool(
  limit: number,
  excludeIds: ReadonlySet<string> = new Set()
): Promise<{ poses: Pose[]; hasMore: boolean }> {
  if (shouldUseMocks()) {
    const pool = shufflePoses(MOCK_POSES).filter((pose) => !excludeIds.has(pose.id));
    return {
      poses: pool.slice(0, limit),
      hasMore: pool.length > limit || MOCK_POSES.length > excludeIds.size + limit,
    };
  }

  try {
    const { count, error: countError } = await supabase
      .from("poses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    if (countError) {
      console.warn("[poses] home pool count failed:", countError.message);
      return getMockHomePool(limit, excludeIds);
    }

    const total = count ?? 0;
    if (total === 0) {
      return { poses: [], hasMore: false };
    }

    const fetchSize = Math.min(Math.max(limit * 3, limit + 6), total);
    const maxOffset = Math.max(0, total - fetchSize);
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(randomOffset, randomOffset + fetchSize - 1);

    if (error) {
      console.warn("[poses] home pool failed:", error.message);
      return getMockHomePool(limit, excludeIds);
    }

    const poses = shufflePoses(
      (data ?? [])
        .map((row) => rowToPose(row as Record<string, unknown>))
        .filter((pose) => !excludeIds.has(pose.id))
    ).slice(0, limit);

    return {
      poses,
      hasMore: total > excludeIds.size + poses.length,
    };
  } catch (error) {
    console.warn("[poses] home pool error:", error);
    return getMockHomePool(limit, excludeIds);
  }
}

function getMockHomePool(limit: number, excludeIds: ReadonlySet<string>) {
  if (!shouldUseMocks()) {
    return { poses: [], hasMore: false };
  }

  const pool = shufflePoses(MOCK_POSES).filter((pose) => !excludeIds.has(pose.id));
  return {
    poses: pool.slice(0, limit),
    hasMore: pool.length > limit || MOCK_POSES.length > excludeIds.size + limit,
  };
}

export async function fetchPoseById(id: string): Promise<Pose | null> {
  if (shouldUseMocks()) return MOCK_POSES.find((p) => p.id === id) ?? null;

  try {
    const { data, error } = await supabase
      .from("poses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.warn("[poses] by id failed:", error.message);
      return null;
    }
    if (!data) return null;
    return rowToPose(data as Record<string, unknown>);
  } catch (error) {
    console.warn("[poses] by id error:", error);
    return null;
  }
}