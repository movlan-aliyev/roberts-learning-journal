"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Skills removed -- redirect home. */
export default function SkillsGone() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <div className="max-w-sm mx-auto px-[var(--spacing-page)] py-16 text-center text-sm text-muted">
      Skills removed. Going home...
    </div>
  );
}
