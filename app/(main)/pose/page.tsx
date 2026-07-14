"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, FolderPlus, Heart, MapPin, Share2, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/GlassCard";
import { MotionSheet } from "@/components/MotionSheet";
import { getFilterLabel } from "@/lib/filters";
import { fetchPoseById } from "@/lib/poses";
import { sharePose } from "@/lib/share-pose";
import { getReturnPath } from "@/lib/scroll-restore";
import { useDynamicBackground } from "@/hooks/useDynamicBackground";
import { useTranslation } from "@/hooks/useTranslation";
import type { Pose } from "@/lib/types";
import { SAVED_FOLDER_ID, useFavoritesStore } from "@/stores/useFavoritesStore";

function PoseDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useTranslation();
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

  useDynamicBackground(pose?.imageUrl);

  useEffect(() => {
    ensureDefaults();
  }, [ensureDefaults]);

  useEffect(() => {
    if (!id) return;
    void fetchPoseById(id).then(setPose);
  }, [id]);

  if (!id) {
    return (
      <GlassCard className="p-8 text-center">{t("poseNotFound")}</GlassCard>
    );
  }

  if (!pose) {
    return (
      <GlassCard className="animate-pulse p-10 text-center text-sm text-[var(--text-secondary)]">
        {t("poseLoading")}
      </GlassCard>
    );
  }

  const share = () => {
    void sharePose({ poseId: pose.id, title: pose.title });
  };

  const infoChips = [
    ...pose.locations.slice(0, 3).map((item) => ({
      key: `loc-${item}`,
      label: getFilterLabel(item, language),
      icon: MapPin,
    })),
    ...pose.peopleCount.slice(0, 1).map((item) => ({
      key: `people-${item}`,
      label: getFilterLabel(item, language),
      icon: Users,
    })),
    ...pose.styles.slice(0, 3).map((item) => ({
      key: `style-${item}`,
      label: getFilterLabel(item, language),
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

  const goBack = () => {
    router.push(getReturnPath() ?? "/");
  };

  return (
    <div className="angle-ui-detail-shell">
      <button
        type="button"
        onClick={goBack}
        className="angle-btn-icon mb-3 inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold"
      >
        <ArrowLeft size={16} />
        {t("commonBack")}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-4 flex justify-center"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Image
          src={pose.imageUrl}
          alt={pose.title}
          width={1200}
          height={1600}
          className="angle-pose-hero-image"
          sizes="(max-width: 768px) 100vw, 480px"
          draggable={false}
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="angle-inner-glass mb-4 p-4 md:p-5"
      >
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Angle
          </p>
          <h1 className="mt-1 text-[22px] font-extrabold leading-tight md:text-[20px]">
            {pose.title}
          </h1>
        </div>

        {infoChips.length ? (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {infoChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <div
                  key={chip.key}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-chip)] px-2.5 py-1 text-[11px] font-semibold"
                >
                  <Icon size={12} className="text-[var(--text-secondary)]" />
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
            data-active={isStarred}
            className="angle-btn-icon h-10 md:h-9"
            aria-label={t("poseLike")}
          >
            <Heart
              size={17}
              className={isStarred ? "fill-[var(--accent-like)] text-[var(--accent-like)]" : undefined}
            />
          </button>
          <button
            type="button"
            onClick={openFolderPicker}
            data-active={isInCustomFolder}
            className="angle-btn-icon h-10 md:h-9"
            aria-label={t("poseAddFolder")}
          >
            <FolderPlus size={17} />
          </button>
          <button
            type="button"
            onClick={share}
            className="angle-btn-primary h-10 md:h-9"
            aria-label={t("poseShare")}
          >
            <Share2 size={17} />
          </button>
        </div>
      </motion.div>

      <MotionSheet opaque open={foldersOpen} onClose={() => setFoldersOpen(false)}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-bold">{t("poseFolderTitle")}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {t("poseFolderSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFoldersOpen(false)}
            className="text-sm font-semibold text-[var(--text-secondary)]"
          >
            {t("commonClose")}
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
                className={`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm font-semibold transition-transform active:scale-[0.98] ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)]"
                }`}
              >
                <span>{folder.name}</span>
                {active ? <Check size={16} /> : null}
              </button>
            );
          })}
        </div>
      </MotionSheet>
    </div>
  );
}

export default function PoseDetailPage() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<GlassCard className="p-10 text-center">{t("poseLoading")}</GlassCard>}>
      <PoseDetailInner />
    </Suspense>
  );
}
