"use client";

import { supabase } from "@/lib/supabase";
import type { FavoriteFolder, FavoriteItem } from "@/lib/types";

const SAVED_FOLDER_ID = "saved";

function isSchemaMissingError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const record = error as { code?: string; message?: string };
  return (
    record.code === "PGRST205" ||
    record.message?.includes("favorite_folders") === true ||
    record.message?.includes("favorite_items") === true
  );
}

function emptyRemoteSnapshot(): FavoritesSnapshot {
  return {
    folders: ensureSavedFolder([]),
    items: [],
  };
}

export type FavoritesSnapshot = {
  folders: FavoriteFolder[];
  items: FavoriteItem[];
};

function ensureSavedFolder(folders: FavoriteFolder[]): FavoriteFolder[] {
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

export async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchCloudFavorites(userId: string): Promise<FavoritesSnapshot> {
  const [{ data: folderRows, error: folderError }, { data: itemRows, error: itemError }] =
    await Promise.all([
      supabase
        .from("favorite_folders")
        .select("id,name,is_pinned,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("favorite_items")
        .select("pose_id,folder_id,saved_at")
        .eq("user_id", userId)
        .order("saved_at", { ascending: true }),
    ]);

  if (folderError) {
    if (isSchemaMissingError(folderError)) return emptyRemoteSnapshot();
    throw new Error(folderError.message);
  }
  if (itemError) {
    if (isSchemaMissingError(itemError)) return emptyRemoteSnapshot();
    throw new Error(itemError.message);
  }

  return {
    folders: ensureSavedFolder(
      (folderRows ?? []).map((row) => ({
        id: String(row.id),
        name: String(row.name),
        isPinned: Boolean(row.is_pinned),
        createdAt: String(row.created_at),
      }))
    ),
    items: (itemRows ?? []).map((row) => ({
      poseId: String(row.pose_id),
      folderId: String(row.folder_id),
      savedAt: String(row.saved_at),
    })),
  };
}

export async function saveCloudFavorites(
  userId: string,
  folders: FavoriteFolder[],
  items: FavoriteItem[]
) {
  const normalizedFolders = ensureSavedFolder(folders);
  const folderIds = normalizedFolders.map((folder) => folder.id);

  const { error: upsertFoldersError } = await supabase.from("favorite_folders").upsert(
    normalizedFolders.map((folder) => ({
      user_id: userId,
      id: folder.id,
      name: folder.name,
      is_pinned: folder.isPinned,
      created_at: folder.createdAt,
    })),
    { onConflict: "user_id,id" }
  );

  if (upsertFoldersError) {
    if (isSchemaMissingError(upsertFoldersError)) return;
    throw new Error(upsertFoldersError.message);
  }

  const { data: existingFolders, error: existingFoldersError } = await supabase
    .from("favorite_folders")
    .select("id")
    .eq("user_id", userId);

  if (existingFoldersError) {
    if (isSchemaMissingError(existingFoldersError)) return;
    throw new Error(existingFoldersError.message);
  }

  const staleFolderIds = (existingFolders ?? [])
    .map((row) => String(row.id))
    .filter((id) => !folderIds.includes(id));

  if (staleFolderIds.length) {
    const { error: deleteFoldersError } = await supabase
      .from("favorite_folders")
      .delete()
      .eq("user_id", userId)
      .in("id", staleFolderIds);

    if (deleteFoldersError) {
      if (isSchemaMissingError(deleteFoldersError)) return;
      throw new Error(deleteFoldersError.message);
    }
  }

  const { error: clearItemsError } = await supabase
    .from("favorite_items")
    .delete()
    .eq("user_id", userId);

  if (clearItemsError) {
    if (isSchemaMissingError(clearItemsError)) return;
    throw new Error(clearItemsError.message);
  }

  if (!items.length) return;

  const { error: insertItemsError } = await supabase.from("favorite_items").insert(
    items.map((item) => ({
      user_id: userId,
      pose_id: item.poseId,
      folder_id: item.folderId,
      saved_at: item.savedAt,
    }))
  );

  if (insertItemsError) {
    if (isSchemaMissingError(insertItemsError)) return;
    throw new Error(insertItemsError.message);
  }
}

export function mergeFavoritesSnapshots(
  local: FavoritesSnapshot,
  remote: FavoritesSnapshot
): FavoritesSnapshot {
  const folders = Array.from(
    new Map(
      [...remote.folders, ...local.folders].map((folder) => [folder.id, folder])
    ).values()
  ).sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  const items = Array.from(
    new Map(
      [...remote.items, ...local.items].map((item) => [
        `${item.poseId}::${item.folderId}`,
        item,
      ])
    ).values()
  );

  return {
    folders: ensureSavedFolder(folders),
    items,
  };
}
