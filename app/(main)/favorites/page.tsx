"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, FolderPlus, Pencil, Share2, Trash2 } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { fetchPoses } from "@/lib/poses";
import type { Pose } from "@/lib/types";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

export default function FavoritesPage() {
  const folders = useFavoritesStore((s) => s.folders);
  const ensureDefaults = useFavoritesStore((s) => s.ensureDefaults);
  const createFolder = useFavoritesStore((s) => s.createFolder);
  const renameFolder = useFavoritesStore((s) => s.renameFolder);
  const deleteFolder = useFavoritesStore((s) => s.deleteFolder);
  const getFolderItems = useFavoritesStore((s) => s.getFolderItems);
  const toggleFolderItem = useFavoritesStore((s) => s.toggleFolderItem);

  const [poses, setPoses] = useState<Pose[]>([]);
  const storeHydrated = useSyncExternalStore(
    (onStoreChange) => useFavoritesStore.persist.onFinishHydration(onStoreChange),
    () => useFavoritesStore.persist.hasHydrated(),
    () => false
  );
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [menuPoseId, setMenuPoseId] = useState<string | null>(null);

  const saveFolderName = (folderId: string) => {
    renameFolder(folderId, editName);
    setEditingId(null);
    setEditName("");
  };

  useEffect(() => {
    ensureDefaults();
    void fetchPoses().then(setPoses);
  }, [ensureDefaults]);

  const sortedFolders = useMemo(
    () => [...folders].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)),
    [folders]
  );

  const poseMap = useMemo(
    () => new Map(poses.map((pose) => [pose.id, pose])),
    [poses]
  );
  const folderCards = useMemo(
    () =>
      sortedFolders.map((folder) => {
        const folderPoseIds = getFolderItems(folder.id);
        const previewPoses = folderPoseIds
          .map((poseId) => poseMap.get(poseId))
          .filter((pose): pose is Pose => Boolean(pose))
          .slice(0, 4);

        return {
          folder,
          total: folderPoseIds.length,
          previewPoses,
        };
      }),
    [sortedFolders, getFolderItems, poseMap]
  );

  const activePoseIds = getFolderItems(activeFolder);
  const activePoses = activeFolder
    ? poses.filter((p) => activePoseIds.includes(p.id))
    : [];
  const activeFolderMeta = activeFolder
    ? folders.find((folder) => folder.id === activeFolder) ?? null
    : null;
  const menuPose = menuPoseId
    ? poses.find((pose) => pose.id === menuPoseId) ?? null
    : null;

  const sharePose = async (pose: Pose) => {
    const url = `${window.location.origin}/pose?id=${pose.id}`;
    if (navigator.share) {
      await navigator.share({ title: pose.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const removeFromActiveFolder = (poseId: string) => {
    if (!activeFolder) return;
    toggleFolderItem(poseId, activeFolder);
    setMenuPoseId(null);
  };

  if (!storeHydrated) {
    return (
      <GlassCard padding="md" className="text-center text-sm text-white/60">
        Загрузка…
      </GlassCard>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-white">Избранное</h1>
          <p className="mt-1 text-sm text-white/55">Папки с сохранёнными позами</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const id = createFolder("Новая папка");
            setActiveFolder(id);
            setEditingId(id);
            setEditName("Новая папка");
          }}
          className="rounded-2xl border border-white/15 bg-white/10 p-3 active:scale-95"
          aria-label="Добавить папку"
        >
          <FolderPlus size={20} className="text-white" />
        </button>
      </div>

      {activeFolder === null ? (
        <div className="mb-5 grid grid-cols-2 gap-3">
          {folderCards.map(({ folder, total, previewPoses }) => (
            <div key={folder.id} className="relative">
              <button
                type="button"
                onClick={() => setActiveFolder(folder.id)}
                className="glass-card relative block aspect-square w-full overflow-hidden rounded-[28px] border border-white/12 bg-white/8 p-3 text-left transition-transform active:scale-[0.98]"
              >
                <div className="grid h-full grid-cols-2 gap-2">
                  {previewPoses.length ? (
                    previewPoses.map((pose) => (
                      <div
                        key={pose.id}
                        className="relative overflow-hidden rounded-2xl bg-white/10"
                      >
                        <Image
                          src={pose.imageUrl}
                          alt={pose.title}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-gradient-to-br from-white/16 to-white/6"
                      />
                    ))
                  )}
                </div>
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/28 px-3 py-2 backdrop-blur-sm">
                  <p className="text-sm font-bold text-white">
                    {folder.isPinned ? "Сохранённое" : folder.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/65">{total} фото</p>
                </div>
              </button>

              {!folder.isPinned ? (
                <div className="pointer-events-none absolute right-3 top-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(folder.id);
                      setEditName(folder.name);
                    }}
                    className="pointer-events-auto rounded-xl bg-black/25 p-2 active:scale-95"
                    aria-label="Переименовать папку"
                  >
                    <Pencil size={14} className="text-white/75" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteFolder(folder.id);
                    }}
                    className="pointer-events-auto rounded-xl bg-black/25 p-2 active:scale-95"
                    aria-label="Удалить папку"
                  >
                    <Trash2 size={14} className="text-[#ff9898]" />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveFolder(null);
                setMenuPoseId(null);
              }}
              className="rounded-2xl border border-white/15 bg-white/10 p-3 active:scale-95"
              aria-label="Назад к папкам"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h2 className="text-[22px] font-bold text-white">
                {activeFolderMeta?.isPinned ? "Сохранённое" : activeFolderMeta?.name}
              </h2>
              <p className="mt-1 text-sm text-white/55">{activePoses.length} фото</p>
            </div>
          </div>

          {activePoses.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {activePoses.map((pose) => (
                <FavoritePoseCard
                  key={pose.id}
                  pose={pose}
                  onLongPress={() => setMenuPoseId(pose.id)}
                />
              ))}
            </div>
          ) : null}
        </>
      )}

      {editingId ? (
        <GlassCard className="mb-4" padding="md">
          <p className="mb-2 text-sm font-semibold text-white/70">Название папки</p>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveFolderName(editingId);
              }
              if (e.key === "Escape") {
                setEditingId(null);
                setEditName("");
              }
            }}
            className="w-full rounded-2xl border border-white/20 bg-black/20 px-3 py-3 text-sm text-white outline-none"
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => saveFolderName(editingId)}
              className="flex-1 rounded-2xl bg-[#B8956B] py-3 text-sm font-bold text-white"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditName("");
              }}
              className="flex-1 rounded-2xl border border-white/15 bg-white/8 py-3 text-sm font-bold text-white"
            >
              Отмена
            </button>
          </div>
        </GlassCard>
      ) : null}

      {menuPose && activeFolder ? (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/45 px-4 pb-4 pt-10 backdrop-blur-sm"
          onClick={() => setMenuPoseId(null)}
        >
          <div
            className="safe-bottom mx-auto w-full max-w-lg rounded-[28px] border border-white/12 bg-[#4A382C]/96 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/20" />
            <p className="mb-1 text-center text-base font-bold text-white">
              {menuPose.title}
            </p>
            <p className="mb-4 text-center text-sm text-white/50">
              Выберите действие для этой фотографии
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  void sharePose(menuPose);
                  setMenuPoseId(null);
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-3.5 text-left text-sm font-bold text-white"
              >
                <Share2 size={18} />
                <span>Поделиться</span>
              </button>
              <button
                type="button"
                onClick={() => removeFromActiveFolder(menuPose.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-[#A95555] px-4 py-3.5 text-left text-sm font-bold text-white"
              >
                <Trash2 size={18} />
                <span>Удалить из папки</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuPoseId(null)}
                className="flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/6 py-3.5 text-sm font-bold text-white/85"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FavoritePoseCard({
  pose,
  onLongPress,
}: {
  pose: Pose;
  onLongPress: () => void;
}) {
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [longPressed, setLongPressed] = useState(false);

  const clearPressTimer = () => {
    if (pressTimer) {
      window.clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const startLongPress = () => {
    clearPressTimer();
    setLongPressed(false);
    const timer = window.setTimeout(() => {
      setLongPressed(true);
      onLongPress();
      setPressTimer(null);
    }, 420);
    setPressTimer(timer);
  };

  const openContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clearPressTimer();
    setLongPressed(true);
    onLongPress();
  };

  return (
    <Link
      href={`/pose?id=${pose.id}`}
      className="active:scale-[0.97]"
      onClick={(e) => {
        if (longPressed) {
          e.preventDefault();
          setLongPressed(false);
        }
      }}
      onPointerDown={startLongPress}
      onPointerUp={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onPointerCancel={clearPressTimer}
      onContextMenu={openContextMenu}
    >
      <div className="angle-popular-card h-40 overflow-hidden">
        <Image
          src={pose.imageUrl}
          alt={pose.title}
          fill
          className="object-cover"
          sizes="50vw"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-2.5 left-2.5 right-2.5 text-sm font-bold text-white">
          {pose.title}
        </p>
      </div>
    </Link>
  );
}
