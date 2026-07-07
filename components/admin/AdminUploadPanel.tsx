"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";

import { AdminQueueSection, type QueueItem } from "@/components/admin/AdminQueueSection";
import { AdminUploadFilters } from "@/components/admin/AdminUploadFilters";
import { adminFetch, adminUploadFile } from "@/lib/admin-api";
import {
  applyBulkRenameTemplate,
  createImageThumbnail,
  isImageFile,
} from "@/lib/admin-upload-utils";
import { EMPTY_FILTER_SELECTION } from "@/lib/filters";
import { selectionToPosePayload } from "@/lib/pose-publish";
import type { Pose, PoseFilterSelection } from "@/lib/types";

type AdminUploadPanelProps = {
  onPublished: (pose: Pose) => void;
};

function uid() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AdminUploadPanel({ onPublished }: AdminUploadPanelProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState<PoseFilterSelection>(EMPTY_FILTER_SELECTION);

  const pendingCount = queue.filter((item) => item.status === "pending").length;

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(isImageFile);
    if (!imageFiles.length) {
      setMessage("Не найдено изображений (поддерживаются JPG, PNG, WebP…)");
      return;
    }

    const nextItems: QueueItem[] = await Promise.all(
      imageFiles.map(async (file) => ({
        id: uid(),
        file,
        preview: await createImageThumbnail(file),
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        status: "pending" as const,
      }))
    );

    setQueue((prev) => [...prev, ...nextItems]);
    setActiveId((prev) => prev ?? nextItems[0]?.id ?? null);
    setMessage("");
  }, []);

  const handleTitleChange = useCallback((id: string, title: string) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setQueue((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      const next = prev.filter((item) => item.id !== id);
      setActiveId((current) => (current === id ? next[0]?.id ?? null : current));
      return next;
    });
  }, []);

  const handleBulkRename = useCallback((template: string) => {
    setQueue((prev) => applyBulkRenameTemplate(prev, template) as QueueItem[]);
    setMessage("Названия обновлены");
  }, []);

  const publishQueue = async () => {
    const pending = queue.filter((item) => item.status === "pending");
    if (!pending.length) return;

    setUploading(true);
    setMessage(`Загрузка 0 / ${pending.length}…`);

    let done = 0;
    for (const item of pending) {
      setQueue((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, status: "uploading", error: undefined } : row
        )
      );

      try {
        const title = item.title.trim() || item.file.name;
        const payload = selectionToPosePayload(filters, title);
        const { publicUrl, key } = await adminUploadFile(item.file);

        const { pose } = await adminFetch("/api/poses", {
          method: "POST",
          body: JSON.stringify({
            imageUrl: publicUrl,
            imageKey: key,
            ...payload,
          }),
        });

        setQueue((prev) =>
          prev.map((row) => (row.id === item.id ? { ...row, status: "done" } : row))
        );
        onPublished(pose as Pose);
        done += 1;
        setMessage(`Загружено ${done} / ${pending.length}`);
      } catch (error) {
        setQueue((prev) =>
          prev.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  status: "error",
                  error: error instanceof Error ? error.message : "Ошибка",
                }
              : row
          )
        );
      }
    }

    setUploading(false);
    setMessage(done ? `Готово: ${done} поз опубликовано` : "Не удалось загрузить");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#2a211a]/80 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Загрузка поз</h2>
          <p className="mt-1 text-sm text-white/50">Название + фильтры → сразу в ленте</p>
        </div>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            {pendingCount} в очереди
          </span>
        ) : null}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
        }}
        className={`mb-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragOver
            ? "border-[#B8956B] bg-[#B8956B]/10"
            : "border-white/15 bg-white/5 hover:border-white/25"
        }`}
      >
        <ImagePlus className="mb-2 text-white/60" size={28} />
        <p className="text-sm font-semibold text-white">Перетащи фото или выбери файлы</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <AdminQueueSection
        queue={queue}
        activeId={activeId}
        uploading={uploading}
        onSelect={setActiveId}
        onRemove={handleRemove}
        onTitleChange={handleTitleChange}
        onBulkRename={handleBulkRename}
      />

      <AdminUploadFilters selection={filters} onChange={setFilters} />

      <button
        type="button"
        disabled={!pendingCount || uploading}
        onClick={() => void publishQueue()}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B8956B] py-3.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        {uploading ? "Публикуем…" : `Опубликовать${pendingCount ? ` (${pendingCount})` : ""}`}
      </button>

      {message ? <p className="mt-3 text-sm font-medium text-emerald-200/90">{message}</p> : null}
    </div>
  );
}
