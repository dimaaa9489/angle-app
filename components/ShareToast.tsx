"use client";

import { useEffect, useState } from "react";

import { SHARE_TOAST_EVENT } from "@/lib/share-toast";

export function ShareToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      setMessage(customEvent.detail.message);
    };

    window.addEventListener(SHARE_TOAST_EVENT, handler);
    return () => window.removeEventListener(SHARE_TOAST_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="angle-share-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
