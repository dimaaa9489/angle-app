"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PosesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("mode");
    next.delete("flow");
    const query = next.toString();
    router.replace(query ? `/search?${query}` : "/search");
  }, [router, searchParams]);

  return (
    <div className="angle-home-panel p-8 text-center text-sm text-white/60">
      Загрузка…
    </div>
  );
}

export default function PosesPage() {
  return (
    <Suspense
      fallback={
        <div className="angle-home-panel p-8 text-center text-sm text-white/60">
          Загрузка…
        </div>
      }
    >
      <PosesRedirect />
    </Suspense>
  );
}
