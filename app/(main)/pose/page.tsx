"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, FolderPlus, Heart, MapPin, Share2, Sparkles, Users } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { getFilterLabel } from "@/lib/filters";
import { fetchPoseById } from "@/lib/poses";
import type { Pose } from "@/lib/types";
import { SAVED_FOLDER_ID, useFavoritesStore } from "@/stores/useFavoritesStore";

function PoseDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pose, setPose] = useState<Pose | null>(null);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const isStarred = useFavoritesStore((s) =>
    id ? s.isStarred(id) : false
  );
  const folders = useFavoritesStore((s) => s.folders);
  const toggleStar = useFavoritesStore((s) => s.toggleStar);
  const ensureDefaults = useFavoritesStore((s) => s.ensureDefaults);
  const getPoseFolderIds = useFavoritesStore((s) => s.getPoseFolderIds);
  const setPoseFolders = useFavoritesStore((s) => s.setPoseFolders);
  const selectableFolders = folders.filter((folder) => folder.id !== SAVED_FOLDER_ID);
  const folderIds = id ? getPoseFolderIds(id) : [];
  const isInCustomFolder = folderIds.some((folderId) => folderId !== SAVED_FOLDER_ID);

  useEffect(() => {
    ensureDefaults();
  }, [ensureDefaults]);

  useEffect(() => {
    if (!id) return;
    void fetchPoseById(id).then(setPose);
  }, [id]);

  if (!id) {
    return (
      <GlassCard className="p-8 text-center">Поза не найдена</GlassCard>
    );
  }

  if (!pose) {
    return (
      <GlassCard className="animate-pulse p-10 text-center text-sm">
        Загрузка…
      </GlassCard>
    );
  }

  const share = async () => {
    const url = `${window.location.origin}/pose?id=${pose.id}`;
    if (navigator.share) await navigator.share({ title: pose.title, url });
    else await navigator.clipboard.writeText(url);
  };

  const infoChips = [
    ...pose.locations.slice(0, 3).map((item) => ({
      key: `loc-${item}`,
      label: getFilterLabel(item),
      icon: MapPin,
    })),
    ...pose.peopleCount.slice(0, 1).map((item) => ({
      key: `people-${item}`,
      label: getFilterLabel(item),
      icon: Users,
    })),
    ...pose.styles.slice(0, 3).map((item) => ({
      key: `style-${item}`,
      label: getFilterLabel(item),
      icon: Sparkles,
    })),
  ];

  const openFolderPicker = () => {
    setSelectedFolders(getPoseFolderIds(pose.id));
    setFoldersOpen(true);
  };

  const assignFolder = (folderId: string) => {
    const nextSelected = selectedFolders.includes(folderId)
      ? selectedFolders.filter((id) => id !== folderId)
      : [...selectedFolders, folderId];
    setSelectedFolders(nextSelected);
    setPoseFolders(pose.id, nextSelected);
    setFoldersOpen(false);
  };

  return (
    <>
      <div
        className="relative mb-4 overflow-hidden rounded-[30px] border border-white/12 bg-[#E8DDD2] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="relative h-[64dvh] min-h-[420px]">
          <Image
            src={pose.imageUrl}
            alt={pose.title}
            fill
            className="object-cover select-none"
            sizes="100vw"
            draggable={false}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241710]/38 via-transparent to-black/10" />
        </div>
      </div>

      <div className="mb-4 rounded-[30px] border border-white/12 bg-black/20 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/38">
            Angle
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold leading-tight text-white">
            {pose.title}
          </h1>
        </div>

        {infoChips.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {infoChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <div
                  key={chip.key}
                  className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/85"
                >
                  <Icon size={13} className="text-white/65" />
                  <span className="capitalize">{chip.label}</span>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => toggleStar(pose.id)}
            className={`flex h-12 items-center justify-center rounded-2xl border transition-transform active:scale-[0.98] ${
              isStarred
                ? "border-[#B8956B] bg-[#B8956B]/24 text-white"
                : "border-white/12 bg-white/8 text-[#F5EDE4]"
            }`}
            aria-label="Лайк"
          >
            <Heart
              size={19}
              className={isStarred ? "fill-[#ff7887] text-[#ff7887]" : "text-white"}
            />
          </button>
          <button
            type="button"
            onClick={openFolderPicker}
            className={`flex h-12 items-center justify-center rounded-2xl border transition-transform active:scale-[0.98] ${
              isInCustomFolder
                ? "border-[#B8956B] bg-[#B8956B]/24 text-white"
                : "border-white/12 bg-white/8 text-[#F5EDE4]"
            }`}
            aria-label="В папку"
          >
            <FolderPlus size={19} />
          </button>
          <button
            type="button"
            onClick={() => void share()}
            className="flex h-12 items-center justify-center rounded-2xl bg-[#B8956B] text-white transition-transform active:scale-[0.98]"
            aria-label="Поделиться"
          >
            <Share2 size={19} />
          </button>
        </div>
      </div>

      {foldersOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/45 px-4 pb-4 pt-10 backdrop-blur-sm"
          onClick={() => setFoldersOpen(false)}
        >
          <div
            className="safe-bottom mx-auto w-full max-w-lg rounded-[28px] border border-white/12 bg-[#4A382C]/96 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/20" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-bold text-white">Добавить в папку</p>
                <p className="mt-1 text-sm text-white/50">Выберите одну из папок ниже</p>
              </div>
              <button
                type="button"
                onClick={() => setFoldersOpen(false)}
                className="text-sm font-semibold text-white/65"
              >
                Закрыть
              </button>
            </div>
            <div className="space-y-2">
              {selectableFolders.map((folder) => {
                const active = selectedFolders.includes(folder.id);
                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => assignFolder(folder.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-transform active:scale-[0.98] ${
                      active
                        ? "border-[#B8956B] bg-[#B8956B]/20 text-white"
                        : "border-white/12 bg-white/8 text-white/85"
                    }`}
                  >
                    <span>{folder.name}</span>
                    {active ? <Check size={16} className="opacity-90" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function PoseDetailPage() {
  return (
    <Suspense fallback={<GlassCard className="p-10 text-center">Загрузка…</GlassCard>}>
      <PoseDetailInner />
    </Suspense>
  );
}
