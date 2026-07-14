import { NextResponse } from "next/server";

import { searchPosesServer } from "@/lib/search/search-poses-server";
import type { PoseFilters } from "@/lib/types";

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseFilters(searchParams: URLSearchParams): PoseFilters {
  return {
    query: searchParams.get("q") ?? "",
    categories: parseList(searchParams.get("categories")) as PoseFilters["categories"],
    locations: parseList(searchParams.get("locations")) as PoseFilters["locations"],
    shotTypes: parseList(searchParams.get("shotTypes")) as PoseFilters["shotTypes"],
    peopleCount: parseList(searchParams.get("peopleCount")) as PoseFilters["peopleCount"],
    sessionTypes: parseList(searchParams.get("sessionTypes")) as PoseFilters["sessionTypes"],
    styles: parseList(searchParams.get("styles")) as PoseFilters["styles"],
  };
}

/** Server-side pose search — PostgreSQL FTS + dictionary expansion + exact match refine. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseFilters(searchParams);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 24), 1), 96);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const result = await searchPosesServer(filters, limit, offset, { useAdmin: true });

    return NextResponse.json(
      {
        poses: result.poses,
        total: result.total,
        hasMore: result.hasMore,
        source: result.source,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[search/poses]", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
