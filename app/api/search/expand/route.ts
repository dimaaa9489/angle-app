import { expandSearchQuery } from "@/lib/i18n/search-query-expand";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const variants = await expandSearchQuery(q);
  return Response.json({ variants });
}
