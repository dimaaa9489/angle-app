import { AdminQuickUpload } from "@/components/admin/AdminQuickUpload";

export default function AdminPage() {
  return (
    <main className="min-h-dvh bg-[#E8DDD2] px-4 py-8">
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-extrabold text-[#2F251D]">Angle Admin</h1>
        <p className="text-sm text-[#7A6A5D]">
          Быстрая загрузка: фото → Cloudflare R2 → Supabase. Работает на Vercel
          (не в APK-сборке).
        </p>
        <AdminQuickUpload />
      </div>
    </main>
  );
}
