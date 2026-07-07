"use client";

import { memo, useCallback, useState } from "react";
import { Loader2, PencilLine, X } from "lucide-react";

export type QueueItem = {
  id: string;
  file: File;
  preview: string;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type AdminQueueSectionProps = {
  queue: QueueItem[];
  activeId: string | null;
  uploading: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onBulkRename: (template: string) => void;
};

const QueueThumb = memo(function QueueThumb({
  item,
  active,
  onSelect,
  onRemove,
}: {
  item: QueueItem;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
        active ? "border-[#B8956B]" : "border-white/10"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.preview} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
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
          onRemove();
        }}
        className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
      >
        <X size={12} />
      </button>
    </button>
  );
});

const ActiveItemEditor = memo(function ActiveItemEditor({
  item,
  onTitleChange,
}: {
  item: QueueItem;
  onTitleChange: (title: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.preview}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
          decoding="async"
        />
      </div>

      <input
        value={item.title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Название позы"
        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
      />

      {item.error ? <p className="text-sm text-red-300">{item.error}</p> : null}
    </div>
  );
});

function BulkRenameBar({ onApply, disabled }: { onApply: (template: string) => void; disabled: boolean }) {
  const [template, setTemplate] = useState("Поза {n}");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 disabled:opacity-40"
      >
        <PencilLine size={14} />
        Массовое переименование
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="mb-2 text-xs font-semibold text-white/55">
        Шаблон: <code className="text-white/80">{"{n}"}</code> — номер,{" "}
        <code className="text-white/80">{"{name}"}</code> — имя файла
      </p>
      <div className="flex gap-2">
        <input
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-sm text-white outline-none"
        />
        <button
          type="button"
          onClick={() => onApply(template)}
          className="shrink-0 rounded-lg bg-[#B8956B] px-3 py-2 text-xs font-bold text-white"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-lg border border-white/15 px-2 py-2 text-white/60"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export const AdminQueueSection = memo(function AdminQueueSection({
  queue,
  activeId,
  uploading,
  onSelect,
  onRemove,
  onTitleChange,
  onBulkRename,
}: AdminQueueSectionProps) {
  const activeItem = queue.find((item) => item.id === activeId) ?? queue[0] ?? null;
  const pendingCount = queue.filter((item) => item.status === "pending").length;

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!activeItem) return;
      onTitleChange(activeItem.id, title);
    },
    [activeItem, onTitleChange]
  );

  if (!queue.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-white/45">{pendingCount} к публикации</p>
        <BulkRenameBar onApply={onBulkRename} disabled={uploading || pendingCount === 0} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {queue.map((item) => (
          <QueueThumb
            key={item.id}
            item={item}
            active={activeItem?.id === item.id}
            onSelect={() => onSelect(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>

      {activeItem ? <ActiveItemEditor item={activeItem} onTitleChange={handleTitleChange} /> : null}
    </div>
  );
});
