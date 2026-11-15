"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

/** Write / Study / Settings -- owner only. Guests may browse and review. */
export function OwnerGuard({ children }: { children: React.ReactNode }) {
  const { isOwner, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isOwner) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [loading, isOwner, pathname, router]);

  if (loading) {
    return (
      <div className="max-w-sm mx-auto px-[var(--spacing-page)] py-16 text-center text-muted text-sm">
        Checking access...
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-sm mx-auto px-[var(--spacing-page)] py-16 text-center">
        <Card padding="lg">
          <Lock size={28} className="text-muted mx-auto mb-3" />
          <h1 className="font-serif text-xl font-bold mb-2">Owner only</h1>
          <p className="text-sm text-muted mb-4">
            Visitors can browse Skills and Journal, and use Review. Only Robert can write, study, or change the site.
          </p>
          <Link href="/login">
            <Button size="sm">Owner sign-in</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
