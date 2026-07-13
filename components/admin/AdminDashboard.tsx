"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AdminConfigBanner } from "@/components/admin/AdminConfigBanner";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPoseList } from "@/components/admin/AdminPoseList";
import { AdminUploadPanel } from "@/components/admin/AdminUploadPanel";
import { admin } from "@/components/admin/admin-ui";

export function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AdminGate>
      <AdminConfigBanner />
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className={admin.overline}>Angle Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold text-[#111111]">Загрузка поз</h1>
        </div>
        <Link href="/" className={admin.link}>
          <ArrowLeft size={16} />
          В приложение
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminUploadPanel onPublished={() => setRefreshKey((value) => value + 1)} />
        <AdminPoseList refreshKey={refreshKey} />
      </div>
    </AdminGate>
  );
}
