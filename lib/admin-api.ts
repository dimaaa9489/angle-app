import { normalizeUploadFile } from "@/lib/admin-upload-utils";
import { supabase } from "@/lib/supabase";

export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function adminFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  if (!token) throw new Error("Войдите через Google");

  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Сеть недоступна. Открой /admin на Vercel (angle-app-jet.vercel.app), не preview-ссылку.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Ошибка ${response.status}`);
  }

  return response.json();
}

export async function adminUploadFile(file: File) {
  const token = await getAccessToken();
  if (!token) throw new Error("Войдите через Google");

  const normalized = await normalizeUploadFile(file);
  const formData = new FormData();
  formData.append("file", normalized);

  let response: Response;
  try {
    response = await fetch("/api/upload/direct", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  } catch {
    throw new Error("Не удалось отправить фото на сервер. Проверь интернет и redeploy на Vercel.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Ошибка загрузки ${response.status}`);
  }

  return response.json() as Promise<{ publicUrl: string; key: string }>;
}
