"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallbackHref = "/questions", label = "Back" }: { fallbackHref?: string; label?: string }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button className="secondary-action" type="button" onClick={goBack}>
      {label}
    </button>
  );
}
