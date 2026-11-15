"use client";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border dark:border-border-dark mt-16 py-8 px-[var(--spacing-page)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted dark:text-muted-dark">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-teal" />
          <span>Robert&#39;s Learning Journal</span>
        </div>
        <nav className="flex gap-4" aria-label="Footer">
          <Link href="/journal" className="hover:text-ink dark:hover:text-ink-light transition-colors">Journal</Link>
          <Link href="/explore" className="hover:text-ink dark:hover:text-ink-light transition-colors">Explore</Link>
          <Link href="/learn/review" className="hover:text-ink dark:hover:text-ink-light transition-colors">Review</Link>
          <Link href="/about" className="hover:text-ink dark:hover:text-ink-light transition-colors">About</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} Robert Aliyev</p>
      </div>
    </footer>
  );
}
