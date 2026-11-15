"use client";

/** Previously gated private pages. Site is free and open -- always render children. */
export function OwnerGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
