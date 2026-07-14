"use client";

import { useDeferredValue, useEffect, useState } from "react";

import { expandQueryVariants } from "@/lib/i18n/search-expansion";

export function useSearchQueryVariants(query: string) {
  const deferredQuery = useDeferredValue(query.trim());
  const [variants, setVariants] = useState<string[]>(() =>
    deferredQuery ? expandQueryVariants(deferredQuery) : []
  );
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!deferredQuery) {
      setVariants([]);
      setPending(false);
      return;
    }

    setVariants(expandQueryVariants(deferredQuery));

    if (deferredQuery.length < 2) {
      setPending(false);
      return;
    }

    let cancelled = false;
    setPending(true);

    void fetch(`/api/search/expand?q=${encodeURIComponent(deferredQuery)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { variants?: string[] } | null) => {
        if (cancelled) return;
        setVariants(data?.variants?.length ? data.variants : expandQueryVariants(deferredQuery));
        setPending(false);
      })
      .catch(() => {
        if (!cancelled) setPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  return {
    variants,
    pending: pending && query.trim() !== deferredQuery,
  };
}
