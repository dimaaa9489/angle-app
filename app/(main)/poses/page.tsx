"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTranslation } from "@/hooks/useTranslation";

function PosesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("mode");
    next.delete("flow");
    const query = next.toString();
    router.replace(query ? `/search?${query}` : "/search");
  }, [router, searchParams]);

  return (
    <div className="angle-surface p-8 text-center text-sm text-[var(--text-secondary)]">
      {t("commonLoading")}
    </div>
  );
}

export default function PosesPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="angle-surface p-8 text-center text-sm text-[var(--text-secondary)]">
          {t("commonLoading")}
        </div>
      }
    >
      <PosesRedirect />
    </Suspense>
  );
}
