import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-8 py-24 text-center">
      <h1 className="font-serif text-6xl font-bold text-teal mb-4">404</h1>
      <p className="text-lg text-muted mb-6">This page doesn&#39;t exist yet.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal-light transition-colors">
        Go home
      </Link>
    </div>
  );
}
