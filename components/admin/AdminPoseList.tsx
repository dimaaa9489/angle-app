"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";

import { adminFetch } from "@/lib/admin-api";
import type { Pose } from "@/lib/types";

type AdminPoseListProps = {
  refreshKey?: number;
};

export function AdminPoseList({ refreshKey = 0 }: AdminPoseListProps) {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPoses = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminFetch("/api/poses");
        if (!cancelled) setPoses(data.poses as Pose[]);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchPoses();
    return () => {
      cancelled = true;
    };
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

  const reload = async () => {
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

  return (
    <div className="rounded-2xl border border-white/10 bg-[#2a211a]/80 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Опубликованные позы</h2>
          <p className="mt-1 text-sm text-white/50">{poses.length} в базе</p>
        </div>
        <button
          type="button"
          onClick={() => void reload()}
          className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80"
        >
          Обновить
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-white/50">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {!loading && !poses.length ? (
        <p className="py-8 text-center text-sm text-white/45">
          Пока пусто — загрузи первую позу слева
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {poses.map((pose) => (
          <article
            key={pose.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
          >
            <div className="relative aspect-[3/4]">
              <Image src={pose.imageUrl} alt={pose.title} fill className="object-cover" sizes="160px" />
            </div>
            <div className="space-y-1 p-2.5">
              <p className="line-clamp-2 text-xs font-semibold text-white">{pose.title}</p>
              {pose.keywords.length > 0 ? (
                <p className="line-clamp-2 text-[10px] text-white/45">
                  {pose.keywords.map((tag) => `#${tag}`).join(" ")}
                </p>
              ) : null}
              <div className="flex gap-1 pt-1">
                <Link
                  href={`/pose?id=${pose.id}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 py-1.5 text-[10px] font-semibold text-white"
                >
                  <ExternalLink size={12} />
                  Открыть
                </Link>
                <button
                  type="button"
                  onClick={() => void removePose(pose.id)}
                  className="rounded-lg bg-red-500/15 px-2 py-1.5 text-red-200"
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
