"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { PoseSearchExplorer } from "@/components/PoseSearchExplorer";

function SearchContent() {
  const searchParams = useSearchParams();
  return <PoseSearchExplorer key={searchParams.toString()} />;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="angle-home-panel p-8 text-center text-sm text-white/60">
          Загрузка…
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
