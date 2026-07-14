"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, FolderPlus, Pencil, Share2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/GlassCard";
import { MotionSheet } from "@/components/MotionSheet";
import { fetchPoses } from "@/lib/poses";
import { sharePose } from "@/lib/share-pose";
import type { Pose } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

export default function FavoritesPage() {
  const { t } = useTranslation();
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
        const resolvedPoses = folderPoseIds
          .map((poseId) => poseMap.get(poseId))
          .filter((pose): pose is Pose => Boolean(pose));

        return {
          folder,
          total: resolvedPoses.length,
          previewPoses: resolvedPoses.slice(0, 4),
        };
      }),
    [sortedFolders, getFolderItems, poseMap]
  );

  const activePoseIds = activeFolder ? getFolderItems(activeFolder) : [];
  const activePoses = activePoseIds
    .map((poseId) => poseMap.get(poseId))
    .filter((pose): pose is Pose => Boolean(pose));
  const activeFolderMeta = activeFolder
    ? folders.find((folder) => folder.id === activeFolder) ?? null
    : null;
  const menuPose = menuPoseId
    ? poses.find((pose) => pose.id === menuPoseId) ?? null
    : null;

  const sharePoseAction = (pose: Pose) => {
    void sharePose({ poseId: pose.id, title: pose.title });
  };

  const removeFromActiveFolder = (poseId: string) => {
    if (!activeFolder) return;
    toggleFolderItem(poseId, activeFolder);
    setMenuPoseId(null);
  };

  if (!storeHydrated) {
    return (
      <GlassCard padding="md" className="text-center text-sm text-[var(--text-secondary)]">
        {t("commonLoading")}
      </GlassCard>
    );
  }

  return (
    <>
      <div className="angle-ui-shell">
        <div className="angle-page-head mb-4 flex items-center justify-between gap-3">
          <div>
            <h1>{t("favoritesTitle")}</h1>
            <p>{t("favoritesSubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const name = t("favoritesNewFolder");
              const id = createFolder(name);
              setActiveFolder(id);
              setEditingId(id);
              setEditName(name);
            }}
            className="angle-btn-icon p-2.5"
            aria-label={t("favoritesAddFolder")}
          >
            <FolderPlus size={18} />
          </button>
        </div>
      </div>

      {activeFolder === null ? (
        <div className="angle-folders-grid mb-5">
          {folderCards.map(({ folder, total, previewPoses }, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setActiveFolder(folder.id)}
                className="angle-folder-card relative block aspect-square w-full overflow-hidden p-2.5 text-left"
              >
                <div className="grid h-full grid-cols-2 gap-1.5">
                  {previewPoses.length ? (
                    previewPoses.map((pose) => (
                      <div
                        key={pose.id}
                        className="relative aspect-square overflow-hidden rounded-[calc(var(--radius-md)-2px)] bg-[var(--bg-input)]"
                      >
                        <Image
                          src={pose.imageUrl}
                          alt={pose.title}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    ))
                  ) : (
                    Array.from({ length: 4 }).map((_, cellIndex) => (
                      <div
                        key={cellIndex}
                        className="aspect-square rounded-[calc(var(--radius-md)-2px)] bg-[var(--accent-soft)]"
                      />
                    ))
                  )}
                </div>
                <div className="absolute inset-x-2.5 bottom-2.5 rounded-[calc(var(--radius-md)-2px)] bg-black/40 px-2.5 py-2 backdrop-blur-sm">
                  <p className="truncate text-[13px] font-bold text-white">
                    {folder.isPinned ? t("favoritesSaved") : folder.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/75">
                    {t("favoritesPhotos", { count: total })}
                  </p>
                </div>
              </button>

              {!folder.isPinned ? (
                <div className="pointer-events-none absolute right-2 top-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(folder.id);
                      setEditName(folder.name);
                    }}
                    className="pointer-events-auto angle-btn-icon p-1.5"
                    aria-label={t("favoritesRenameFolder")}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteFolder(folder.id);
                    }}
                    className="pointer-events-auto angle-btn-icon p-1.5 text-[var(--accent-danger)]"
                    aria-label={t("favoritesDeleteFolder")}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="angle-ui-shell">
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveFolder(null);
                setMenuPoseId(null);
              }}
              className="angle-btn-icon p-2.5"
              aria-label={t("favoritesBackFolders")}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="angle-page-head mb-0 min-w-0">
              <h2 className="truncate text-[18px] font-bold">
                {activeFolderMeta?.isPinned ? t("favoritesSaved") : activeFolderMeta?.name}
              </h2>
              <p>{t("favoritesPhotos", { count: activePoses.length })}</p>
            </div>
          </div>

          {activePoses.length > 0 ? (
            <div className="angle-feed-grid-responsive grid grid-cols-2 gap-3">
              {activePoses.map((pose) => (
                <FavoritePoseCard
                  key={pose.id}
                  pose={pose}
                  onLongPress={() => setMenuPoseId(pose.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {editingId ? (
        <div className="angle-ui-shell">
          <GlassCard className="mb-4" padding="md">
          <p className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">
            {t("favoritesFolderName")}
          </p>
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
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-input)] px-3 py-3 text-sm outline-none"
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => saveFolderName(editingId)}
              className="angle-btn-primary flex-1 py-3 text-sm"
            >
              {t("commonSave")}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setEditName("");
              }}
              className="angle-btn-secondary flex-1 py-3 text-sm"
            >
              {t("commonCancel")}
            </button>
          </div>
          </GlassCard>
        </div>
      ) : null}

      <MotionSheet open={Boolean(menuPose && activeFolder)} onClose={() => setMenuPoseId(null)}>
        {menuPose ? (
          <>
            <p className="mb-1 text-center text-base font-bold">{menuPose.title}</p>
            <p className="mb-4 text-center text-sm text-[var(--text-secondary)]">
              {t("favoritesChooseAction")}
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sharePoseAction(menuPose);
                  setMenuPoseId(null);
                }}
                className="angle-btn-secondary flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-bold"
              >
                <Share2 size={18} />
                <span>{t("favoritesShare")}</span>
              </button>
              <button
                type="button"
                onClick={() => removeFromActiveFolder(menuPose.id)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-md)] bg-[var(--accent-danger)] px-4 py-3.5 text-left text-sm font-bold text-white"
              >
                <Trash2 size={18} />
                <span>{t("favoritesRemoveFromFolder")}</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuPoseId(null)}
                className="angle-btn-secondary w-full py-3.5 text-sm font-bold"
              >
                {t("commonCancel")}
              </button>
            </div>
          </>
        ) : null}
      </MotionSheet>
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
      <div className="angle-popular-card relative aspect-[4/5] overflow-hidden">
        <Image
          src={pose.imageUrl}
          alt={pose.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 260px"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-2 left-2 right-2 truncate text-[13px] font-bold text-white">
          {pose.title}
        </p>
      </div>
    </Link>
  );
}
