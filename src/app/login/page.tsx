"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/** Login removed -- site is free and open. Redirect to Study. */
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/learn/today");
  }, [router]);

  return (
    <div className="max-w-sm mx-auto px-[var(--spacing-page)] py-16 text-center">
      <Card padding="lg">
        <h1 className="font-serif text-xl font-bold mb-2">No login needed</h1>
        <p className="text-sm text-muted mb-4">
          This journal is free and open. Study, review, and write without an account.
        </p>
        <Link href="/learn/today"><Button>Go to Study</Button></Link>
      </Card>
    </div>
  );
}
