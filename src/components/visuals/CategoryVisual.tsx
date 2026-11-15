"use client";
import type { ReactNode } from "react";
import { FlagGallery, SEA_FLAGS, FlagSvg } from "./Flag";
import { RegionMapSEA } from "./RegionMap";
import { RayleighDiagram } from "./ScienceDiagram";
import { BookCover } from "./BookCover";

/** Renders the right visual for a category or program slug. */
export function CategoryVisual({
  categorySlug,
  variant = "full",
}: {
  categorySlug: string;
  variant?: "full" | "card" | "banner";
}) {
  if (categorySlug === "flags") {
    if (variant === "card") {
      return (
        <div className="grid grid-cols-5 gap-1">
          {SEA_FLAGS.slice(0, 5).map((id) => (
            <FlagSvg key={id} id={id} className="w-full rounded" />
          ))}
        </div>
      );
    }
    return (
      <>
        <FlagGallery ids={SEA_FLAGS} />
        <RegionMapSEA />
      </>
    );
  }

  if (categorySlug === "geography") return <RegionMapSEA />;
  if (categorySlug === "science") return <RayleighDiagram />;

  if (categorySlug === "books") {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 my-4">
        {["Atomic Habits", "Sapiens", "The Alchemist", "Thinking Fast", "Deep Work"].map((t) => (
          <BookCover key={t} title={t} creator="Example" type="book" />
        ))}
      </div>
    );
  }

  if (categorySlug === "movies") {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 my-4">
        {["Inception", "Spirited Away", "The Godfather", "Parasite", "Amelie"].map((t) => (
          <BookCover key={t} title={t} type="film" />
        ))}
      </div>
    );
  }

  return <SkillPoster slug={categorySlug} />;
}

const SKILL_ART: Record<string, { title: string; subtitle: string; bg: string; shapes: ReactNode }> = {
  quran: {
    title: "Quran Study",
    subtitle: "Verse - Translation - Reflection",
    bg: "linear-gradient(135deg,#0d3b2e 0%,#1a6b4a 100%)",
    shapes: (
      <>
        <rect x="70" y="40" width="100" height="80" rx="4" fill="#fff" opacity="0.15" />
        <line x1="85" y1="60" x2="155" y2="60" stroke="#B28B4B" strokeWidth="2" />
        <line x1="85" y1="75" x2="155" y2="75" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
        <line x1="85" y1="90" x2="140" y2="90" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
      </>
    ),
  },
  sports: {
    title: "Sports",
    subtitle: "Rules - Records - Culture",
    bg: "linear-gradient(135deg,#6b2d00 0%,#d35400 100%)",
    shapes: (
      <>
        <circle cx="120" cy="80" r="35" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />
        <path d="M120 45 Q145 80 120 115 Q95 80 120 45" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" />
      </>
    ),
  },
  literature: {
    title: "Literature",
    subtitle: "Poems - Quotes - Ideas",
    bg: "linear-gradient(135deg,#2c1848 0%,#6c3483 100%)",
    shapes: (
      <>
        <text x="120" y="85" textAnchor="middle" fill="#B28B4B" fontSize="48" fontFamily="Georgia,serif" opacity="0.7">&quot;</text>
        <line x1="70" y1="100" x2="170" y2="100" stroke="#fff" strokeWidth="1" opacity="0.3" />
      </>
    ),
  },
  brands: {
    title: "Brands",
    subtitle: "Origin - Design - Lessons",
    bg: "linear-gradient(135deg,#1a1a1a 0%,#2c3e50 100%)",
    shapes: (
      <>
        <rect x="75" y="50" width="90" height="60" rx="6" fill="none" stroke="#B28B4B" strokeWidth="3" />
        <text x="120" y="88" textAnchor="middle" fill="#F7F5EF" fontSize="14" fontWeight="600">BRAND</text>
      </>
    ),
  },
  history: {
    title: "History",
    subtitle: "Events - Eras - People",
    bg: "linear-gradient(135deg,#3e2723 0%,#8B4513 100%)",
    shapes: (
      <>
        <rect x="55" y="45" width="20" height="70" fill="#B28B4B" opacity="0.7" />
        <rect x="85" y="60" width="20" height="55" fill="#F7F5EF" opacity="0.35" />
        <rect x="115" y="50" width="20" height="65" fill="#B28B4B" opacity="0.55" />
        <rect x="145" y="70" width="20" height="45" fill="#F7F5EF" opacity="0.3" />
        <line x1="50" y1="115" x2="190" y2="115" stroke="#F7F5EF" strokeWidth="2" opacity="0.5" />
      </>
    ),
  },
};

export function SkillPoster({ slug, className = "" }: { slug: string; className?: string }) {
  const art = SKILL_ART[slug] || {
    title: slug.replace(/-/g, " "),
    subtitle: "Learning track",
    bg: "linear-gradient(135deg,#102033 0%,#167D8D 100%)",
    shapes: <circle cx="120" cy="80" r="30" fill="#fff" opacity="0.2" />,
  };

  return (
    <div className={`rounded-xl overflow-hidden my-4 ${className}`} style={{ background: art.bg }}>
      <svg viewBox="0 0 240 150" className="w-full h-auto" role="img" aria-label={`${art.title} illustration`}>
        {art.shapes}
        <text x="16" y="130" fill="#F7F5EF" fontSize="14" fontWeight="700" fontFamily="Georgia,serif">{art.title}</text>
        <text x="16" y="144" fill="#F7F5EF" fontSize="7" opacity="0.7">{art.subtitle}</text>
      </svg>
    </div>
  );
}

export function LessonVisual({ programSlug, lessonTitle }: { programSlug?: string; lessonTitle?: string }) {
  if (programSlug) return <SkillPoster slug={programSlug} />;
  return (
    <div className="rounded-xl border border-border dark:border-border-dark p-6 bg-teal/5 my-4 text-center">
      <div className="text-4xl mb-2 font-serif text-teal">{(lessonTitle || "Lesson").slice(0, 1)}</div>
      <p className="text-sm text-muted">{lessonTitle}</p>
    </div>
  );
}
