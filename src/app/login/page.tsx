"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";

function LoginForm() {
  const { isOwner, login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const nextRaw = searchParams.get("next") || "/learn/today";
  const next = nextRaw.startsWith("/") ? nextRaw : "/learn/today";

  useEffect(() => {
    if (!loading && isOwner) router.replace(next);
  }, [loading, isOwner, next, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!login(pin)) {
      setError("Wrong PIN. Write and Study stay locked for visitors.");
      return;
    }
    router.replace(next.startsWith("/") ? next : "/learn/today");
  }

  return (
    <div className="max-w-sm mx-auto px-[var(--spacing-page)] py-16">
      <Card padding="lg">
        <div className="text-center mb-6">
          <Lock size={28} className="text-teal mx-auto mb-3" />
          <h1 className="font-serif text-xl font-bold mb-2">Owner sign-in</h1>
          <p className="text-sm text-muted">
            Public visitors can read and review only. This unlocks Write, Study, and Settings for Robert.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Owner PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            aria-label="Owner PIN"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
        <p className="text-xs text-muted text-center mt-4">
          Just browsing?{" "}
          <Link href="/journal" className="text-teal hover:underline">Journal</Link>
          {" - "}
          <Link href="/explore" className="text-teal hover:underline">Explore</Link>
          {" - "}
          <Link href="/learn/review" className="text-teal hover:underline">Review</Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
