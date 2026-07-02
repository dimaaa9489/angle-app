"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPoseList } from "@/components/admin/AdminPoseList";
import { AdminUploadPanel } from "@/components/admin/AdminUploadPanel";

export function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AdminGate>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B8956B]">
            Angle Admin
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">Загрузка поз</h1>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white/80"
        >
          <ArrowLeft size={16} />
          В приложение
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminUploadPanel
          onPublished={() => setRefreshKey((value) => value + 1)}
        />
        <AdminPoseList refreshKey={refreshKey} />
      </div>
    </AdminGate>
  );
}
