"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

import { FilterChipGroups } from "@/components/FilterChipGroups";
import { adminFetch, adminUploadFile } from "@/lib/admin-api";
import { EMPTY_FILTER_SELECTION } from "@/lib/filters";
import { selectionToPosePayload } from "@/lib/pose-publish";
import type { Pose, PoseFilterSelection } from "@/lib/types";

type QueueItem = {
  id: string;
  file: File;
  preview: string;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

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

  const activeItem = queue.find((item) => item.id === activeId) ?? queue[0] ?? null;
  const pendingCount = queue.filter((item) => item.status === "pending").length;

  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) return;

    const nextItems = imageFiles.map((file) => ({
      id: uid(),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      status: "pending" as const,
    }));

    setQueue((prev) => [...prev, ...nextItems]);
    setActiveId((prev) => prev ?? nextItems[0]?.id ?? null);
    setMessage("");
  }, []);

  const updateItem = (id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      const next = prev.filter((item) => item.id !== id);
      setActiveId((current) => (current === id ? next[0]?.id ?? null : current));
      return next;
    });
  };

  const publishQueue = async () => {
    const pending = queue.filter((item) => item.status === "pending");
    if (!pending.length) return;

    setUploading(true);
    setMessage(`Загрузка 0 / ${pending.length}…`);

    let done = 0;
    for (const item of pending) {
      updateItem(item.id, { status: "uploading", error: undefined });
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

        updateItem(item.id, { status: "done" });
        onPublished(pose as Pose);
        done += 1;
        setMessage(`Загружено ${done} / ${pending.length}`);
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Ошибка",
        });
      }
    }

    setUploading(false);
    setMessage(done ? `Готово: ${done} поз опубликовано в приложении` : "Не удалось загрузить");
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
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
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
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {queue.length > 0 ? (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {queue.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                activeItem?.id === item.id ? "border-[#B8956B]" : "border-white/10"
              }`}
            >
              <Image src={item.preview} alt="" fill className="object-cover" />
              {item.status === "uploading" ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="animate-spin text-white" size={16} />
                </span>
              ) : null}
              {item.status === "done" ? <span className="absolute inset-0 bg-emerald-500/40" /> : null}
              {item.status === "error" ? <span className="absolute inset-0 bg-red-500/40" /> : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </button>
          ))}
        </div>
      ) : null}

      {activeItem ? (
        <div className="space-y-4">
          <div className="relative h-48 overflow-hidden rounded-2xl">
            <Image src={activeItem.preview} alt="preview" fill className="object-contain bg-black/30" />
          </div>

          <input
            value={activeItem.title}
            onChange={(e) => updateItem(activeItem.id, { title: e.target.value })}
            placeholder="Название позы"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
          />

          {activeItem.error ? <p className="text-sm text-red-300">{activeItem.error}</p> : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">
          Фильтры для всей очереди
        </p>
        <FilterChipGroups variant="admin" selection={filters} onChange={setFilters} />
      </div>

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
