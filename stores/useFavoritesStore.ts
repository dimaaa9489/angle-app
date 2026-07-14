"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  fetchCloudFavorites,
  getCurrentUserId,
  mergeFavoritesSnapshots,
  saveCloudFavorites,
} from "@/lib/favorites";
import type { FavoriteFolder, FavoriteItem } from "@/lib/types";

const SAVED_FOLDER_ID = "saved";

type FavoritesState = {
  folders: FavoriteFolder[];
  items: FavoriteItem[];
  ensureDefaults: () => void;
  hydrateFromCloud: (userId: string) => Promise<void>;
  createFolder: (name: string) => string;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  isStarred: (poseId: string) => boolean;
  toggleStar: (poseId: string) => void;
  isInFolder: (poseId: string, folderId: string) => boolean;
  toggleFolderItem: (poseId: string, folderId: string) => void;
  getFolderItems: (folderId: string) => string[];
  getPoseFolderIds: (poseId: string) => string[];
  setPoseFolders: (poseId: string, folderIds: string[]) => void;
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `folder-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function dedupeItems(items: FavoriteItem[]): FavoriteItem[] {
  const map = new Map<string, FavoriteItem>();
  for (const item of items) {
    const key = `${item.poseId}::${item.folderId}`;
    const existing = map.get(key);
    if (!existing || item.savedAt > existing.savedAt) {
      map.set(key, item);
    }
  }
  return [...map.values()];
}

function normalizeItems(items: FavoriteItem[]): FavoriteItem[] {
  return dedupeItems(items);
}

function ensureSavedFolder(folders: FavoriteFolder[]) {
  if (folders.some((folder) => folder.id === SAVED_FOLDER_ID)) {
    return folders;
  }

  return [
    {
      id: SAVED_FOLDER_ID,
      name: "Сохранённое",
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    ...folders,
  ];
}

async function syncCloudSnapshot(folders: FavoriteFolder[], items: FavoriteItem[]) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await saveCloudFavorites(userId, folders, items);
  } catch (error) {
    console.warn("[favorites] cloud sync skipped:", error);
  }
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      folders: [
        {
          id: SAVED_FOLDER_ID,
          name: "Сохранённое",
          isPinned: true,
          createdAt: new Date().toISOString(),
        },
      ],
      items: [],

      ensureDefaults: () => {
        const { folders, items } = get();
        const nextFolders = ensureSavedFolder(folders);
        const nextItems = normalizeItems(items);
        if (
          nextItems.length !== items.length ||
          !folders.some((f) => f.id === SAVED_FOLDER_ID)
        ) {
          set({ folders: nextFolders, items: nextItems });
        }
      },

      hydrateFromCloud: async (userId) => {
        try {
          const localSnapshot = {
            folders: ensureSavedFolder(get().folders),
            items: get().items,
          };
          const remoteSnapshot = await fetchCloudFavorites(userId);
          const merged = mergeFavoritesSnapshots(localSnapshot, remoteSnapshot);
          set({
            folders: merged.folders,
            items: normalizeItems(merged.items),
          });
          await saveCloudFavorites(userId, merged.folders, normalizeItems(merged.items));
        } catch (error) {
          console.warn("[favorites] cloud hydrate skipped:", error);
        }
      },

      createFolder: (name) => {
        const id = uid();
        const nextFolders = [
          ...get().folders,
          {
            id,
            name: name.trim() || "Новая папка",
            isPinned: false,
            createdAt: new Date().toISOString(),
          },
        ];
        const nextItems = get().items;
        set({ folders: nextFolders });
        void syncCloudSnapshot(nextFolders, nextItems);
        return id;
      },

      renameFolder: (id, name) => {
        if (id === SAVED_FOLDER_ID) return;
        const nextFolders = get().folders.map((f) =>
          f.id === id ? { ...f, name: name.trim() || f.name } : f
        );
        const nextItems = get().items;
        set({ folders: nextFolders });
        void syncCloudSnapshot(nextFolders, nextItems);
      },

      deleteFolder: (id) => {
        if (id === SAVED_FOLDER_ID) return;
        const nextFolders = get().folders.filter((f) => f.id !== id);
        const nextItems = get().items.filter((i) => i.folderId !== id);
        set({
          folders: nextFolders,
          items: nextItems,
        });
        void syncCloudSnapshot(nextFolders, nextItems);
      },

      isStarred: (poseId) =>
        get().items.some(
          (i) => i.poseId === poseId && i.folderId === SAVED_FOLDER_ID
        ),

      toggleStar: (poseId) => {
        const exists = get().isStarred(poseId);
        const nextFolders = get().folders;
        if (exists) {
          const nextItems = get().items.filter(
            (i) => !(i.poseId === poseId && i.folderId === SAVED_FOLDER_ID)
          );
          set({ items: nextItems });
          void syncCloudSnapshot(nextFolders, nextItems);
        } else {
          const nextItems = normalizeItems([
            ...get().items,
            {
              poseId,
              folderId: SAVED_FOLDER_ID,
              savedAt: new Date().toISOString(),
            },
          ]);
          set({ items: nextItems });
          void syncCloudSnapshot(nextFolders, nextItems);
        }
      },

      isInFolder: (poseId, folderId) =>
        get().items.some(
          (i) => i.poseId === poseId && i.folderId === folderId
        ),

      toggleFolderItem: (poseId, folderId) => {
        const exists = get().isInFolder(poseId, folderId);
        const nextFolders = get().folders;
        if (exists) {
          const nextItems = get().items.filter(
            (i) => !(i.poseId === poseId && i.folderId === folderId)
          );
          set({ items: nextItems });
          void syncCloudSnapshot(nextFolders, nextItems);
        } else {
          const nextItems = normalizeItems([
            ...get().items,
            { poseId, folderId, savedAt: new Date().toISOString() },
          ]);
          set({ items: nextItems });
          void syncCloudSnapshot(nextFolders, nextItems);
        }
      },

      getFolderItems: (folderId) => {
        const seen = new Set<string>();
        const poseIds: string[] = [];
        for (const item of get().items) {
          if (item.folderId !== folderId || seen.has(item.poseId)) continue;
          seen.add(item.poseId);
          poseIds.push(item.poseId);
        }
        return poseIds;
      },

      getPoseFolderIds: (poseId) =>
        get()
          .items.filter((i) => i.poseId === poseId)
          .map((i) => i.folderId),

      setPoseFolders: (poseId, folderIds) => {
        const normalizedFolderIds = Array.from(new Set(folderIds));
        const nextFolders = get().folders;
        const nextItems = normalizeItems([
          ...get().items.filter((i) => i.poseId !== poseId),
          ...normalizedFolderIds.map((folderId) => ({
            poseId,
            folderId,
            savedAt: new Date().toISOString(),
          })),
        ]);

        set({ items: nextItems });
        void syncCloudSnapshot(nextFolders, nextItems);
      },
    }),
    {
      name: "angle-favorites",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.items = normalizeItems(state.items);
        state.folders = ensureSavedFolder(state.folders);
      },
    }
  )
);

export { SAVED_FOLDER_ID };
