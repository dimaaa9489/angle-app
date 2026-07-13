import { GlassCard } from "@/components/GlassCard";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-[var(--bg-base)] px-4 py-8">
      <div className="mx-auto max-w-lg">
        <GlassCard>
          <h1 className="mb-4 text-2xl font-extrabold">Политика конфиденциальности</h1>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Angle («позы для фотографий») обрабатывает минимум данных: email при
              входе через Google, избранные позы и настройки приложения.
            </p>
            <p>
              Фотографии поз хранятся в Cloudflare R2. Метаданные — в Supabase.
              Мы не продаём персональные данные третьим лицам.
            </p>
            <p>
              По вопросам удаления аккаунта и данных напишите на контактный email
              владельца сервиса.
            </p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
