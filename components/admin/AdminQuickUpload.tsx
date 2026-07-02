"use client";

import { useState } from "react";
import Image from "next/image";

import { GlassCard } from "@/components/GlassCard";
import { PressableGlow } from "@/components/PressableGlow";
import {
  FILTER_CATEGORIES,
  FILTER_LOCATIONS,
  FILTER_PEOPLE,
  FILTER_SESSION_TYPES,
  FILTER_STYLES,
} from "@/lib/filters";
import { createPoseRecord } from "@/lib/poses";
import { supabase } from "@/lib/supabase";
import type {
  LocationTag,
  PeopleCount,
  PoseCategory,
  SessionType,
  ShotType,
  StyleTag,
} from "@/lib/types";

export function AdminQuickUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PoseCategory>("women");
  const [shotType, setShotType] = useState<ShotType>("portrait");
  const [locations, setLocations] = useState<LocationTag[]>([]);
  const [peopleCount, setPeopleCount] = useState<PeopleCount[]>(["1"]);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>(["portrait"]);
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const onFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("Загрузка…");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Войдите в Google в профиле");

      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
        }),
      });
      if (!presignRes.ok) throw new Error("Не удалось получить URL загрузки");
      const { uploadUrl, publicUrl, key } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Ошибка загрузки в R2");

      await createPoseRecord({
        imageUrl: publicUrl,
        imageKey: key,
        title: title || file.name,
        keywords: title.split(/\s+/).filter(Boolean),
        category,
        shotType,
        locations,
        peopleCount,
        sessionTypes,
        styles,
      });

      setStatus("✓ Поза опубликована");
      onFile(null);
      setTitle("");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <h2 className="mb-4 text-xl font-extrabold">Быстрая загрузка позы</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="mb-3 w-full text-sm"
      />

      {preview ? (
        <div className="relative mb-4 h-48 overflow-hidden rounded-2xl">
          <Image src={preview} alt="preview" fill className="object-cover" />
        </div>
      ) : null}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название позы"
        className="glass-card mb-3 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
      />

      <div className="mb-3 grid grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PoseCategory)}
          className="glass-card rounded-xl border px-2 py-2 text-sm"
        >
          {FILTER_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={shotType}
          onChange={(e) => setShotType(e.target.value as ShotType)}
          className="glass-card rounded-xl border px-2 py-2 text-sm"
        >
          <option value="portrait">Портрет</option>
          <option value="full-body">Полный рост</option>
          <option value="half-body">По пояс</option>
        </select>
      </div>

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

      <PressableGlow
        disabled={!file || loading}
        onClick={() => void upload()}
        className="mt-4 w-full bg-[#B8956B] py-3.5 text-center font-bold text-white disabled:opacity-50"
      >
        {loading ? "Отправка…" : "Загрузить и опубликовать"}
      </PressableGlow>
      {status ? <p className="mt-3 text-sm font-medium text-[#5C4735]">{status}</p> : null}
    </GlassCard>
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
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#7A6A5D]">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              selected.includes(item.id)
                ? "border-[#B8956B] bg-[#B8956B]/20"
                : "glass-card border-white/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
