"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/journal", label: "Journal" },
    { href: "/explore", label: "Explore" },
    { href: "/skills", label: "Skills" },
    { href: "/learn/today", label: "Study" },
    { href: "/learn/review", label: "Review" },
    { href: "/studio/posts", label: "Write" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur border-b border-border dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-[var(--spacing-page)] flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold text-ink dark:text-ink-light">
          <BookOpen size={22} className="text-teal" />
          <span className="hidden sm:inline">Robert&#39;s Learning Journal</span>
          <span className="sm:hidden">RLJ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-ink/5 dark:hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border dark:border-border-dark px-[var(--spacing-page)] py-3 space-y-1"
          aria-label="Mobile navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-ink/5 dark:hover:bg-white/10 text-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
