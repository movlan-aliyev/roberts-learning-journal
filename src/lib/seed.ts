import { db } from "./db";
import type {
  OwnerProfile, Category, Program, Module, LessonOutline,
  LessonContent, Post, Flashcard, ReviewState, BookFilm, Enrollment,
} from "./db";
import { v4 as uuid } from "uuid";

const CATEGORIES: Omit<Category, "id">[] = [
  { name: "Flags", slug: "flags", description: "National flags, their symbolism and history", color: "var(--color-cat-flags)", icon: "Fl", order: 0 },
  { name: "Quran", slug: "quran", description: "Verses, translations, tafsir and personal reflection", color: "var(--color-cat-quran)", icon: "Qr", order: 1 },
  { name: "Geography", slug: "geography", description: "Countries, capitals, maps and landscapes", color: "var(--color-cat-geography)", icon: "Geo", order: 2 },
  { name: "Science", slug: "science", description: "How things work -- physics, biology, chemistry, earth", color: "var(--color-cat-science)", icon: "Sci", order: 3 },
  { name: "Sports", slug: "sports", description: "Rules, records, history and athletic culture", color: "var(--color-cat-sports)", icon: "Sp", order: 4 },
  { name: "Literature", slug: "literature", description: "Poems, quotations, authors and literary ideas", color: "var(--color-cat-literature)", icon: "Lit", order: 5 },
  { name: "Movies", slug: "movies", description: "Film analysis, directors, storytelling and visual art", color: "var(--color-cat-movies)", icon: "Mv", order: 6 },
  { name: "Brands", slug: "brands", description: "Origin, design, business lessons and industry", color: "var(--color-cat-brands)", icon: "Br", order: 7 },
  { name: "Books", slug: "books", description: "Reading, reviews and ideas from books", color: "var(--color-cat-books)", icon: "Bk", order: 8 },
  { name: "History", slug: "history", description: "Events, eras, people and how the past shaped today", color: "#8B4513", icon: "Hi", order: 9 },
];;

/* Programs removed -- journal / explore / review only */
const PROGRAMS: Omit<Program, "id">[] = [];

const FLAG_POST: Omit<Post, "id"> = {
  title: "10 Flags I Learned: Southeast Asia",
  slug: "10-flags-southeast-asia",
  categoryIds: [], // filled during seed
  language: "en",
  status: "published",
  whatILearned: `I studied ten flags from Southeast Asia. Each flag tells a story about its country's history, values and identity. Here are the ten flags with their key features:\n\n**1. Thailand** -- Five horizontal stripes: red, white, blue, white, red. The wide blue center represents the monarchy. Red for the nation, white for Buddhism.\n\n**2. Vietnam** -- Red field with a large yellow five-pointed star. Red represents revolution; the star's five points symbolize workers, peasants, soldiers, intellectuals and youth.\n\n**3. Indonesia** -- Two horizontal bands: red over white. Known as "Sang Saka Merah-Putih." Red for courage, white for purity. Nearly identical to Monaco's flag but with different proportions.\n\n**4. Philippines** -- Two horizontal bands (blue over red) with a white triangle at the hoist containing a sun and three stars. The sun's eight rays represent the first provinces that revolted against Spain.\n\n**5. Malaysia** -- 14 alternating red and white stripes with a blue canton containing a yellow crescent and 14-pointed star. The 14 stripes and star points represent the 13 states plus the federal government.\n\n**6. Singapore** -- Two horizontal halves: red over white. A white crescent moon and five stars in the red section. The crescent represents a rising nation; the five stars stand for democracy, peace, progress, justice and equality.\n\n**7. Cambodia** -- Three horizontal bands: blue, red (double width), blue, with a white depiction of Angkor Wat in the center. One of few flags to feature a building.\n\n**8. Myanmar** -- Three horizontal stripes: yellow, green, red, with a large white five-pointed star in the center. Adopted in 2010. Yellow for solidarity, green for peace and lush environment, red for courage.\n\n**9. Laos** -- Three horizontal bands: red, blue (double width), red, with a white circle in the center. The white circle represents the full moon over the Mekong River and the promise of unity.\n\n**10. Brunei** -- Yellow field with white and black diagonal stripes and a red crest in the center. Yellow represents the Sultan. The crest includes an umbrella (royal symbol), wings, hands and a crescent with inscription.`,
  myPerspective: "",
  exampleThatClicked: "Indonesia and Monaco have almost the same flag -- red over white -- but Indonesia's is wider. Thailand's flag is the only one in this set where the center stripe is a different color and wider than the rest, making it immediately recognizable.",
  stillWantToUnderstand: "How do countries with similar flags handle confusion at international events? Are there formal protocols?",
  glossary: {
    "canton": { en: "The upper-left quarter of a flag" },
    "hoist": { en: "The side of the flag closest to the flagpole" },
  },
  sources: [
    { id: uuid(), type: "website", title: "CIA World Factbook -- Flags of the World", author: "Central Intelligence Agency", url: "https://www.cia.gov/the-world-factbook/", checkedDate: "2026-11-15", license: "Public domain (US government)", note: "Flag descriptions and country data" },
    { id: uuid(), type: "website", title: "Flags of the World (FOTW)", author: "FOTW", url: "https://www.crwflags.com/fotw/flags/", checkedDate: "2026-11-15", license: "", note: "Vexillological reference" },
  ],
  readingTimeMinutes: 5,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  featuredImage: null,
  featuredImageAlt: null,
  isAiGenerated: false,
  ownerApproved: true,
};

const SCIENCE_POST: Omit<Post, "id"> = {
  title: "Why the Sky Is Blue: Rayleigh Scattering Explained",
  slug: "why-sky-is-blue-rayleigh-scattering",
  categoryIds: [],
  language: "en",
  status: "published",
  whatILearned: `Sunlight contains all visible wavelengths. When it enters Earth's atmosphere, it collides with gas molecules (mainly nitrogen and oxygen). Shorter wavelengths -- violet and blue -- scatter much more than longer wavelengths like red and yellow. This is called **Rayleigh scattering**, named after Lord Rayleigh who described the phenomenon mathematically in the 1870s.\n\nThe scattering intensity is proportional to \\(1/\\lambda^4\\), meaning blue light (shorter wavelength) scatters roughly 5.5 times more than red light. Although violet scatters even more than blue, our eyes are more sensitive to blue, and some violet is absorbed in the upper atmosphere -- so we perceive a blue sky.\n\nAt sunrise and sunset, sunlight travels through more atmosphere. Most blue light scatters away before reaching our eyes, leaving the longer-wavelength reds and oranges that create warm sky colors.`,
  myPerspective: "",
  exampleThatClicked: "Think of it like this: imagine throwing a handful of small and large balls into a forest. The small balls bounce off tree trunks and scatter in all directions, while the large balls pass through more easily. Blue light is like the small balls -- it bounces around the atmosphere in every direction, filling the sky.",
  stillWantToUnderstand: "How does Rayleigh scattering differ from Mie scattering in clouds? Why are clouds white rather than blue?",
  glossary: { "Rayleigh scattering": { en: "Scattering of light by particles much smaller than the wavelength" }, "wavelength": { en: "The distance between successive peaks of a wave" } },
  sources: [
    { id: uuid(), type: "website", title: "Why is the sky blue?", author: "NASA Science", url: "https://science.nasa.gov/", checkedDate: "2026-11-15", license: "Public domain (NASA)", note: "" },
  ],
  readingTimeMinutes: 4,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  featuredImage: null, featuredImageAlt: null,
  isAiGenerated: false, ownerApproved: true,
};


let seedPromise: Promise<void> | null = null;

async function dedupeDatabase() {
  const cats = await db.categories.toArray();
  const seenCat = new Set<string>();
  for (const c of cats) {
    if (seenCat.has(c.slug)) await db.categories.delete(c.id);
    else seenCat.add(c.slug);
  }
  const posts = await db.posts.toArray();
  const seenPost = new Set<string>();
  for (const post of posts) {
    if (seenPost.has(post.slug)) await db.posts.delete(post.id);
    else seenPost.add(post.slug);
  }
}

async function ensureCategories() {
  const existing = await db.categories.toArray();
  const bySlug = new Set(existing.map((c) => c.slug));
  for (const c of CATEGORIES) {
    if (!bySlug.has(c.slug)) {
      await db.categories.put({ ...c, id: `cat-${c.slug}` });
    }
  }
}

/** Delete every skill program and related curriculum from IndexedDB. */
async function ensureNoPrograms() {
  const allProgs = await db.programs.toArray();
  for (const p of allProgs) {
    const outlines = await db.lessonOutlines.where("programId").equals(p.id).toArray();
    for (const o of outlines) {
      await db.lessonContents.where("lessonId").equals(o.id).delete();
      await db.lessonOutlines.delete(o.id);
    }
    await db.modules.where("programId").equals(p.id).delete();
    await db.enrollments.where("programId").equals(p.id).delete();
    await db.programs.delete(p.id);
  }
  const profile = await db.ownerProfile.get("owner");
  if (profile) await db.ownerProfile.update("owner", { activePrograms: [] });
}

export async function seedDatabase() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    await dedupeDatabase();
    const existingProfile = await db.ownerProfile.get("owner");
    const catCount = await db.categories.count();
    if (existingProfile && catCount > 0) {
      await ensureCategories();
      await ensureNoPrograms();
      return;
    }
    await runInitialSeed();
  })();
  return seedPromise;
}

async function runInitialSeed() {
  const now = new Date().toISOString();
  const profile: OwnerProfile = {
    id: "owner", name: "Robert Aliyev", tagline: "Learn something. Understand it. Make it your own.",
    bio: "", timezone: "America/New_York",
    studyDays: [1, 2, 3, 4, 5, 6],
    dailyBudgetMinutes: 91, focusMode: false,
    activePrograms: [], languages: ["en", "tr", "az"],
    theme: "system", createdAt: now, updatedAt: now,
  };
  const categoriesRows: Category[] = CATEGORIES.map(c => ({ ...c, id: `cat-${c.slug}` }));
  const catBySlug = Object.fromEntries(categoriesRows.map(c => [c.slug, c.id]));
  const programs: Program[] = [];
  const flagPost: Post = { ...FLAG_POST, id: uuid(), categoryIds: [catBySlug["flags"], catBySlug["geography"]] };
  const sciencePost: Post = { ...SCIENCE_POST, id: uuid(), categoryIds: [catBySlug["science"]] };
  const flashcards: Flashcard[] = [
    { id: uuid(), postId: flagPost.id, lessonId: null, front: "Which Southeast Asian flag has Angkor Wat on it?", back: "Cambodia", tags: ["flags", "southeast-asia"], createdAt: now },
    { id: uuid(), postId: flagPost.id, lessonId: null, front: "Thailand's flag has 5 stripes. What does the blue center represent?", back: "The monarchy", tags: ["flags", "southeast-asia"], createdAt: now },
    { id: uuid(), postId: flagPost.id, lessonId: null, front: "Which two countries have nearly identical red-over-white flags?", back: "Indonesia and Monaco (Indonesia's has different proportions)", tags: ["flags", "southeast-asia"], createdAt: now },
    { id: uuid(), postId: flagPost.id, lessonId: null, front: "What does 'canton' mean in flag terminology?", back: "The upper-left quarter of a flag", tags: ["flags", "vocabulary"], createdAt: now },
    { id: uuid(), postId: flagPost.id, lessonId: null, front: "How many points does the Philippine sun have, and what do they represent?", back: "Eight rays -- representing the first eight provinces that revolted against Spain", tags: ["flags", "southeast-asia"], createdAt: now },
  ];
  const reviewStates: ReviewState[] = flashcards.map(f => ({
    id: uuid(), flashcardId: f.id, interval: 1, easeFactor: 2.5,
    nextReviewDate: new Date().toISOString().split("T")[0],
    lastReviewDate: null, reviewCount: 0, status: "new" as const,
  }));
  await db.transaction("rw",
    [db.ownerProfile, db.categories, db.posts, db.bookFilms,
     db.programs, db.modules, db.lessonOutlines, db.lessonContents,
     db.enrollments, db.flashcards, db.reviewStates],
    async () => {
      await db.ownerProfile.put(profile);
      await db.categories.bulkPut(categoriesRows);
      await db.posts.bulkPut([flagPost, sciencePost]);
      await db.programs.bulkPut(programs);
      await db.flashcards.bulkPut(flashcards);
      await db.reviewStates.bulkPut(reviewStates);
    }
  );
  console.log(`Seeded: ${categoriesRows.length} categories, 0 programs, ${flashcards.length} flashcards`);
}
