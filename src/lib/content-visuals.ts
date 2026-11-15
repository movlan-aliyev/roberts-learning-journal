/**
 * Content generation always attaches a visual type.
 * Every post, lesson, and skill unit must declare how it is illustrated.
 */

export type VisualType =
  | "flag-gallery"
  | "region-map"
  | "science-diagram"
  | "book-cover"
  | "film-poster"
  | "skill-poster"
  | "comparison-table"
  | "timeline"
  | "labeled-diagram"
  | "arabic-verse"
  | "none";

export interface ContentVisualSpec {
  type: VisualType;
  categorySlug?: string;
  programSlug?: string;
  caption?: string;
  required: true; // always required by product rule
}

/** Pick the default visual for a category or program. Never returns "none" for known topics. */
export function defaultVisualFor(opts: {
  categorySlugs?: string[];
  programSlug?: string;
  title?: string;
}): ContentVisualSpec {
  const cats = opts.categorySlugs || [];
  if (cats.includes("flags")) {
    return { type: "flag-gallery", categorySlug: "flags", caption: "Flag gallery", required: true };
  }
  if (cats.includes("geography")) {
    return { type: "region-map", categorySlug: "geography", caption: "Region map", required: true };
  }
  if (cats.includes("science")) {
    return { type: "science-diagram", categorySlug: "science", caption: "Science diagram", required: true };
  }
  if (cats.includes("books")) {
    return { type: "book-cover", categorySlug: "books", caption: "Book cover", required: true };
  }
  if (cats.includes("movies")) {
    return { type: "film-poster", categorySlug: "movies", caption: "Film poster", required: true };
  }
  if (cats.includes("quran")) {
    return { type: "arabic-verse", categorySlug: "quran", caption: "Verse block", required: true };
  }
  if (opts.programSlug) {
    return {
      type: "skill-poster",
      programSlug: opts.programSlug,
      caption: `${opts.programSlug} illustration`,
      required: true,
    };
  }
  // Fallback: skill poster keyed by first category or generic
  const slug = cats[0] || "literature";
  return { type: "skill-poster", categorySlug: slug, caption: "Topic illustration", required: true };
}

/** Human-readable checklist shown in the editor. */
export function visualChecklist(spec: ContentVisualSpec): string[] {
  const items = [
    "Visual type selected (required)",
    `Type: ${spec.type}`,
  ];
  if (spec.categorySlug) items.push(`Category: ${spec.categorySlug}`);
  if (spec.programSlug) items.push(`Program: ${spec.programSlug}`);
  items.push("Caption or alt text recommended");
  return items;
}
