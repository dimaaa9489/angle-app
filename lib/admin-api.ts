import { supabase } from "@/lib/supabase";

export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function adminFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  if (!token) throw new Error("Войдите через Google");

  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Ошибка ${response.status}`);
  }

  return response.json();
}
