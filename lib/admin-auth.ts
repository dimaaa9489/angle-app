import { createClient } from "@supabase/supabase-js";

import { isAdminEmail } from "@/lib/admin-emails";

export { getAdminEmails, getAdminEmailsStatus, isAdminEmail } from "@/lib/admin-emails";

export async function getUserFromRequest(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const token = auth.slice(7);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data } = await supabase.auth.getUser(token);
  return data.user ?? null;
}

export async function requireAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user?.email || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}
