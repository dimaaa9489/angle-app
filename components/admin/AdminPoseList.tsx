"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Languages, Loader2, Trash2 } from "lucide-react";

import { adminFetch } from "@/lib/admin-api";
import { admin } from "@/components/admin/admin-ui";
import type { Pose } from "@/lib/types";

type AdminPoseListProps = {
  refreshKey?: number;
};

export function AdminPoseList({ refreshKey = 0 }: AdminPoseListProps) {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [repairing, setRepairing] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [error, setError] = useState("");

  const loadPoses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch("/api/poses");
      setPoses(data.poses as Pose[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPoses();
  }, [refreshKey]);

  const removePose = async (id: string) => {
    if (!confirm("Удалить позу из приложения?")) return;
    try {
      await adminFetch(`/api/poses/${id}`, { method: "DELETE" });
      setPoses((prev) => prev.filter((pose) => pose.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Не удалось удалить");
    }
  };

  const repairImages = async () => {
    setRepairing(true);
    setError("");
    try {
      const data = await adminFetch("/api/admin/repair-images", { method: "POST" });
      await loadPoses();
      alert(`Починено ссылок: ${data.repaired ?? 0}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось починить ссылки");
    } finally {
      setRepairing(false);
    }
  };

  const reindexKeywords = async () => {
    if (!confirm("Пересобрать keywords для всех поз (перевод на 18 языков)?")) return;
    setReindexing(true);
    setError("");
    try {
      const data = await adminFetch("/api/admin/reindex-keywords", { method: "POST" });
      await loadPoses();
      alert(`Обновлено: ${data.updated ?? 0} из ${data.total ?? 0}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить keywords");
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className={admin.card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={admin.title}>Опубликованные позы</h2>
          <p className={admin.subtitle}>{poses.length} в базе</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={reindexing}
            onClick={() => void reindexKeywords()}
            className={admin.btnSecondary}
          >
            {reindexing ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Languages size={14} />
            )}
            {reindexing ? "Индекс…" : "Перевод keywords"}
          </button>
          <button
            type="button"
            disabled={repairing}
            onClick={() => void repairImages()}
            className={admin.btnSecondary}
          >
            {repairing ? "Чиним…" : "Починить фото"}
          </button>
          <button type="button" onClick={() => void loadPoses()} className={admin.btnSecondary}>
            Обновить
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-[#a3a3a3]">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : null}

      {error ? <p className={admin.error}>{error}</p> : null}

      {!loading && !poses.length ? (
        <p className="py-8 text-center text-sm text-[#a3a3a3]">
          Пока пусто — загрузи первую позу слева
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {poses.map((pose) => (
          <article
            key={pose.id}
            className="overflow-hidden rounded-[var(--radius-sm)] border border-[rgba(0,0,0,0.08)] bg-[#fafafa]"
          >
            <div className="relative aspect-[3/4] bg-[#f0f0f0]">
              <Image src={pose.imageUrl} alt={pose.title} fill className="object-cover" sizes="160px" />
            </div>
            <div className="space-y-1 p-2.5">
              <p className="line-clamp-2 text-xs font-semibold text-[#111111]">{pose.title}</p>
              {pose.keywords.length > 0 ? (
                <p className="line-clamp-2 text-[10px] text-[#a3a3a3]">
                  {pose.keywords.length} keywords
                </p>
              ) : null}
              <div className="flex gap-1 pt-1">
                <Link
                  href={`/pose?id=${pose.id}`}
                  target="_blank"
                  className={`${admin.btnSecondary} flex-1 py-1.5 text-[10px]`}
                >
                  <ExternalLink size={12} />
                  Открыть
                </Link>
                <button
                  type="button"
                  onClick={() => void removePose(pose.id)}
                  className={admin.btnDanger}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
