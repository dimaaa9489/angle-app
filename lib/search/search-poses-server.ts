import { resolvePoseImageUrl } from "@/lib/pose-image-url";
import { shufflePosesSeeded } from "@/lib/pose-feed-layout";
import { MOCK_POSES } from "@/lib/mock-poses";
import { getSearchShuffleSeed, matchesPoseFilters } from "@/lib/pose-utils";
import { prepareSearchQuery } from "@/lib/search/prepare-search-query";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import type { Pose, PoseFilters } from "@/lib/types";

const RPC_CANDIDATE_LIMIT = 500;

export type SearchPosesResult = {
  poses: Pose[];
  total: number;
  hasMore: boolean;
  source: "rpc" | "fallback";
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
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

function getDbClient(useAdmin = false) {
  if (useAdmin) {
    try {
      return getSupabaseAdmin();
    } catch {
      return supabase;
    }
  }
  return supabase;
}

async function searchViaRpc(
  filters: PoseFilters,
  limit: number,
  offset: number,
  useAdmin: boolean
): Promise<SearchPosesResult | null> {
  const prepared = prepareSearchQuery(filters);
  const client = getDbClient(useAdmin);

  const { data, error } = await client.rpc("search_poses", {
    p_query: prepared.query,
    p_categories: prepared.categories,
    p_locations: prepared.locations,
    p_shot_types: prepared.shotTypes,
    p_people_count: prepared.peopleCount,
    p_session_types: prepared.sessionTypes,
    p_styles: prepared.styles,
    p_terms: prepared.terms,
    p_limit: RPC_CANDIDATE_LIMIT,
    p_offset: 0,
  });

  if (error) {
    if (
      error.message.includes("search_poses") ||
      error.message.includes("search_document") ||
      error.code === "42883"
    ) {
      return null;
    }
    throw error;
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const matched = rows
    .map((row) => rowToPose(row))
    .filter((pose) => matchesPoseFilters(pose, filters));

  const shuffled = shufflePosesSeeded(matched, getSearchShuffleSeed(filters));
  const total = shuffled.length;
  const page = shuffled.slice(offset, offset + limit);

  return {
    poses: page,
    total,
    hasMore: offset + limit < total,
    source: "rpc",
  };
}

async function searchViaFallback(
  filters: PoseFilters,
  limit: number,
  offset: number,
  useAdmin: boolean
): Promise<SearchPosesResult> {
  const prepared = prepareSearchQuery(filters);
  const client = getDbClient(useAdmin);

  let query = client
    .from("poses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(RPC_CANDIDATE_LIMIT);

  if (prepared.categories.length) {
    query = query.in("category", prepared.categories);
  }
  if (prepared.shotTypes.length) {
    query = query.in("shot_type", prepared.shotTypes);
  }
  if (prepared.locations.length) {
    query = query.overlaps("locations", prepared.locations);
  }
  if (prepared.peopleCount.length) {
    query = query.overlaps("people_count", prepared.peopleCount);
  }
  if (prepared.sessionTypes.length) {
    query = query.overlaps("session_types", prepared.sessionTypes);
  }
  if (prepared.styles.length) {
    query = query.overlaps("styles", prepared.styles);
  }

  const { data, error } = await query;
  if (error) throw error;

  const matched = (data ?? [])
    .map((row) => rowToPose(row as Record<string, unknown>))
    .filter((pose) => matchesPoseFilters(pose, filters));

  const shuffled = shufflePosesSeeded(matched, getSearchShuffleSeed(filters));
  const total = shuffled.length;
  const page = shuffled.slice(offset, offset + limit);

  return {
    poses: page,
    total,
    hasMore: offset + limit < total,
    source: "fallback",
  };
}

export async function searchPosesServer(
  filters: PoseFilters,
  limit: number,
  offset: number,
  options: { useAdmin?: boolean } = {}
): Promise<SearchPosesResult> {
  if (!hasSupabaseConfig()) {
    const matched = MOCK_POSES.filter((pose) => matchesPoseFilters(pose, filters));
    const shuffled = shufflePosesSeeded(matched, getSearchShuffleSeed(filters));
    return {
      poses: shuffled.slice(offset, offset + limit),
      total: shuffled.length,
      hasMore: offset + limit < shuffled.length,
      source: "fallback",
    };
  }

  const rpcResult = await searchViaRpc(filters, limit, offset, options.useAdmin ?? false);
  if (rpcResult) return rpcResult;

  return searchViaFallback(filters, limit, offset, options.useAdmin ?? false);
}
