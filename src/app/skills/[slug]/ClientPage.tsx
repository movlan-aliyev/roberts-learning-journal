"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** All skill tracks removed -- redirect home. */
export default function SkillSlugGone() {
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
