"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isOwner, loading, logout } = useAuth();

  const publicLinks = [
    { href: "/journal", label: "Journal" },
    { href: "/explore", label: "Explore" },
    { href: "/learn/review", label: "Review" },
    { href: "/about", label: "About" },
  ];

  const ownerLinks = [
    { href: "/learn/today", label: "Study" },
    { href: "/studio/posts", label: "Write" },
    { href: "/settings", label: "Settings" },
  ];

  const links = isOwner
    ? [...publicLinks.slice(0, 3), ...ownerLinks, publicLinks[3]]
    : publicLinks;

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
          {!loading && (
            isOwner ? (
              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-ink/5 dark:hover:bg-white/10 inline-flex items-center gap-1"
                aria-label="Sign out"
              >
                <LogOut size={14} /> Out
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm rounded-md hover:bg-ink/5 dark:hover:bg-white/10 inline-flex items-center gap-1"
              >
                <LogIn size={14} /> Owner
              </Link>
            )
          )}
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
          {!loading && (
            isOwner ? (
              <button
                type="button"
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-ink/5 text-sm"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-ink/5 text-sm"
              >
                Owner sign-in
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
