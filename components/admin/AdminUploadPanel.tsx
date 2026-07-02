"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

import { adminFetch } from "@/lib/admin-api";
import {
  FILTER_CATEGORIES,
  FILTER_LOCATIONS,
  FILTER_PEOPLE,
  FILTER_SESSION_TYPES,
  FILTER_SHOT_TYPES,
  FILTER_STYLES,
} from "@/lib/filters";
import { formatHashtagPreview, parseHashtags } from "@/lib/hashtags";
import type {
  LocationTag,
  PeopleCount,
  Pose,
  PoseCategory,
  SessionType,
  ShotType,
  StyleTag,
} from "@/lib/types";

type QueueItem = {
  id: string;
  file: File;
  preview: string;
  title: string;
  hashtags: string;
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

  const [category, setCategory] = useState<PoseCategory>("women");
  const [shotType, setShotType] = useState<ShotType>("portrait");
  const [locations, setLocations] = useState<LocationTag[]>([]);
  const [peopleCount, setPeopleCount] = useState<PeopleCount[]>(["1"]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>(["portrait"]);
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const activeItem = queue.find((item) => item.id === activeId) ?? queue[0] ?? null;
  const pendingCount = queue.filter((item) => item.status === "pending").length;
  const parsedTags = useMemo(
    () => parseHashtags(activeItem?.hashtags ?? ""),
    [activeItem?.hashtags]
  );

  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) return;

    const nextItems = imageFiles.map((file) => ({
      id: uid(),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      hashtags: "",
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

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
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
        const keywords = parseHashtags(item.hashtags);
        const title = item.title.trim() || item.file.name;

        const { uploadUrl, publicUrl, key } = await adminFetch("/api/upload/presign", {
          method: "POST",
          body: JSON.stringify({
            filename: item.file.name,
            contentType: item.file.type || "image/jpeg",
          }),
        });

        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": item.file.type || "image/jpeg" },
          body: item.file,
        });
        if (!putRes.ok) throw new Error("Не удалось загрузить фото в облако");

        const { pose } = await adminFetch("/api/poses", {
          method: "POST",
          body: JSON.stringify({
            imageUrl: publicUrl,
            imageKey: key,
            title,
            keywords,
            category,
            shotType,
            locations,
            peopleCount,
            sessionTypes,
            styles,
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
          <p className="mt-1 text-sm text-white/50">
            Фото → Cloudflare R2 → Supabase → сразу в ленте приложения
          </p>
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
        className={`mb-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragOver
            ? "border-[#B8956B] bg-[#B8956B]/10"
            : "border-white/15 bg-white/5 hover:border-white/25"
        }`}
      >
        <ImagePlus className="mb-2 text-white/60" size={28} />
        <p className="text-sm font-semibold text-white">Перетащи фото сюда или нажми для выбора</p>
        <p className="mt-1 text-xs text-white/45">Можно выбрать несколько файлов сразу</p>
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
              {item.status === "done" ? (
                <span className="absolute inset-0 bg-emerald-500/40" />
              ) : null}
              {item.status === "error" ? (
                <span className="absolute inset-0 bg-red-500/40" />
              ) : null}
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
        <div className="space-y-3">
          <div className="relative mb-2 h-56 overflow-hidden rounded-2xl">
            <Image src={activeItem.preview} alt="preview" fill className="object-contain bg-black/30" />
          </div>

          <input
            value={activeItem.title}
            onChange={(e) => updateItem(activeItem.id, { title: e.target.value })}
            placeholder="Название позы"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
          />

          <div>
            <input
              value={activeItem.hashtags}
              onChange={(e) => updateItem(activeItem.id, { hashtags: e.target.value })}
              placeholder="Хештеги: #портрет #студия #мягкий-свет"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
            />
            {parsedTags.length > 0 ? (
              <p className="mt-1.5 text-xs text-white/45">{formatHashtagPreview(parsedTags)}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PoseCategory)}
              className="rounded-xl border border-white/10 bg-black/20 px-2 py-2 text-sm text-white"
            >
              {FILTER_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              value={shotType}
              onChange={(e) => setShotType(e.target.value as ShotType)}
              className="rounded-xl border border-white/10 bg-black/20 px-2 py-2 text-sm text-white"
            >
              {FILTER_SHOT_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="text-xs font-semibold text-[#B8956B]"
          >
            {showFilters ? "Скрыть фильтры" : "Теги для поиска (локация, стиль…)"}
          </button>

          {showFilters ? (
            <div className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
              <ChipGroup
                title="Локация"
                items={FILTER_LOCATIONS}
                selected={locations}
                onToggle={(id) => toggle(locations, id, setLocations)}
              />
              <ChipGroup
                title="Люди"
                items={FILTER_PEOPLE}
                selected={peopleCount}
                onToggle={(id) => toggle(peopleCount, id, setPeopleCount)}
              />
              <ChipGroup
                title="Тип сессии"
                items={FILTER_SESSION_TYPES}
                selected={sessionTypes}
                onToggle={(id) => toggle(sessionTypes, id, setSessionTypes)}
              />
              <ChipGroup
                title="Стиль"
                items={FILTER_STYLES}
                selected={styles}
                onToggle={(id) => toggle(styles, id, setStyles)}
              />
              <p className="text-[11px] text-white/40">
                Эти теги применяются ко всей очереди. Хештеги — у каждого фото отдельно.
              </p>
            </div>
          ) : null}

          {activeItem.error ? (
            <p className="text-sm text-red-300">{activeItem.error}</p>
          ) : null}
        </div>
      ) : null}

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

function ChipGroup<T extends string>({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: { id: T; label: string }[];
  selected: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-white/45">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              selected.includes(item.id)
                ? "border-[#B8956B] bg-[#B8956B]/20 text-white"
                : "border-white/15 text-white/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
