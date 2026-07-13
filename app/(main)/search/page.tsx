"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { PoseSearchExplorer } from "@/components/PoseSearchExplorer";
import { useTranslation } from "@/hooks/useTranslation";

function SearchContent() {
  const searchParams = useSearchParams();
  return <PoseSearchExplorer key={searchParams.toString()} />;
}

export default function SearchPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="angle-surface p-8 text-center text-sm text-[var(--text-secondary)]">
          {t("commonLoading")}
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
