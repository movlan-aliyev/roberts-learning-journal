import { db } from "./db";
import type {
  OwnerProfile, Category, Program, Module, LessonOutline,
  LessonContent, Post, Flashcard, ReviewState, BookFilm, Enrollment,
} from "./db";
import { v4 as uuid } from "uuid";

/* ???????????????????????????????????????????
   Categories
   ??????????????????????????????????????????? */
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
];

/* ???????????????????????????????????????????
   Programs -- 7 tracks
   ??????????????????????????????????????????? */
const PROGRAMS: Omit<Program, "id">[] = [
  { name: "Manual Driving Foundations", slug: "driving", description: "Clutch, shifting, road awareness and instructor-supervised practice", durationWeeks: 6, totalUnits: 36, weeklyPattern: "4 concepts + application + review", icon: "DR", color: "#c0392b", order: 0 },
  { name: "Understanding & Planning a 1,400 sq ft Home", slug: "house", description: "Owner-builder literacy from site to occupancy", durationWeeks: 52, totalUnits: 312, weeklyPattern: "4 concepts + application + review", icon: "HM", color: "#2980b9", order: 1 },
  { name: "Gardening: Vegetables, Fruit & Flowers", slug: "gardening", description: "Climate-aware growing from soil to harvest", durationWeeks: 24, totalUnits: 144, weeklyPattern: "4 concepts + application + review", icon: "GD", color: "#27ae60", order: 2 },
  { name: "Livestock Foundations: Sheep & Cattle", slug: "livestock", description: "Responsible animal husbandry with veterinary guidance", durationWeeks: 32, totalUnits: 192, weeklyPattern: "4 concepts + application + review", icon: "LV", color: "#8e6f3e", order: 3 },
  { name: "Automotive Maintenance & Repair Foundations", slug: "automotive", description: "Workshop safety to diagnostic reasoning", durationWeeks: 52, totalUnits: 312, weeklyPattern: "4 concepts + application + review", icon: "AU", color: "#34495e", order: 4 },
  { name: "Firearm Safety & Sport-Shooting Orientation", slug: "firearms", description: "Safe storage, handling principles and supervised range preparation", durationWeeks: 6, totalUnits: 36, weeklyPattern: "4 concepts + application + review", icon: "FS", color: "#7f8c8d", order: 5 },
  { name: "Clear Responses to Difficult Questions", slug: "communication", description: "Listen, structure, explain and practice honest clarity", durationWeeks: 8, totalUnits: 48, weeklyPattern: "4 concepts + application + review", icon: "CM", color: "#9b59b6", order: 6 },
];

/* ???????????????????????????????????????????
   Curriculum outlines -- first 6 units per program
   Each week: 4 concept + 1 application + 1 review
   ??????????????????????????????????????????? */

interface CurriculumWeek {
  weekTitle: string;
  lessons: { title: string; type: "concept" | "application" | "review"; est: number; risk: "standard" | "safety-critical" | "professional-review" }[];
}

const DRIVING_WEEKS: CurriculumWeek[] = [
  { weekTitle: "Week 1: Controls & Safety Foundations", lessons: [
    { title: "The driver's seat: controls, mirrors and their purpose", type: "concept", est: 8, risk: "standard" },
    { title: "How a manual transmission works: clutch, gears, engine", type: "concept", est: 8, risk: "standard" },
    { title: "Reading your vehicle's owner manual", type: "concept", est: 8, risk: "standard" },
    { title: "Legal prerequisites: license, insurance, vehicle inspection", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Pre-drive checklist: applying what you know before starting", type: "application", est: 10, risk: "safety-critical" },
    { title: "Week 1 review: controls and safety recall", type: "review", est: 8, risk: "standard" },
  ]},
  { weekTitle: "Week 2: Starting, Stopping & Smooth Coordination", lessons: [
    { title: "Finding the bite point: how clutch engagement feels", type: "concept", est: 8, risk: "standard" },
    { title: "Starting on flat ground: step-by-step coordination", type: "concept", est: 8, risk: "standard" },
    { title: "Braking smoothly: engine braking vs. foot brake", type: "concept", est: 8, risk: "standard" },
    { title: "Stalling: why it happens and how to restart safely", type: "concept", est: 8, risk: "standard" },
    { title: "Low-speed maneuvers: supervised practice preparation", type: "application", est: 10, risk: "safety-critical" },
    { title: "Week 2 review: starting and stopping recall", type: "review", est: 8, risk: "standard" },
  ]},
  { weekTitle: "Week 3: Shifting, Speed & Scanning", lessons: [
    { title: "When to shift up: reading engine sound and RPM", type: "concept", est: 8, risk: "standard" },
    { title: "Downshifting and rev-matching basics", type: "concept", est: 8, risk: "standard" },
    { title: "Speed awareness: speedometer, road signs, perception", type: "concept", est: 8, risk: "standard" },
    { title: "Scanning the road: mirrors, blind spots, situational awareness", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Practice notes template for instructor sessions", type: "application", est: 10, risk: "standard" },
    { title: "Week 3 review: shifting and scanning recall", type: "review", est: 8, risk: "standard" },
  ]},
  { weekTitle: "Week 4: Hills, Parking & Road Positioning", lessons: [
    { title: "Hill starts: handbrake method and balance point", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Parallel parking: reference points and geometry", type: "concept", est: 8, risk: "standard" },
    { title: "Reversing safely: mirrors, head checks, slow speed", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Lane positioning and road markings", type: "concept", est: 8, risk: "standard" },
    { title: "Supervised parking and hill practice preparation", type: "application", est: 10, risk: "safety-critical" },
    { title: "Week 4 review: maneuvers recall", type: "review", est: 8, risk: "standard" },
  ]},
  { weekTitle: "Week 5: Traffic, Weather & Judgment", lessons: [
    { title: "Traffic flow: intersections, right-of-way, roundabouts", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Driving in rain, fog and limited visibility", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Distraction awareness and focus management", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Vehicle limits: stopping distance, tire grip, load", type: "concept", est: 8, risk: "standard" },
    { title: "Hazard perception exercise and discussion", type: "application", est: 10, risk: "safety-critical" },
    { title: "Week 5 review: judgment and conditions recall", type: "review", est: 8, risk: "standard" },
  ]},
  { weekTitle: "Week 6: Review, Feedback & Readiness", lessons: [
    { title: "Self-assessment: strengths and areas to improve", type: "concept", est: 8, risk: "standard" },
    { title: "Working with instructor feedback effectively", type: "concept", est: 8, risk: "standard" },
    { title: "Building a personal practice plan", type: "concept", est: 8, risk: "standard" },
    { title: "Readiness checklist: am I ready for more independence?", type: "concept", est: 8, risk: "standard" },
    { title: "Capstone: driving preparation portfolio review", type: "application", est: 12, risk: "standard" },
    { title: "Week 6 final review: full program recall", type: "review", est: 10, risk: "standard" },
  ]},
];

const HOUSE_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: The Owner-Builder Role", lessons: [
    { title: "What does an owner-builder actually do?", type: "concept", est: 8, risk: "standard" },
    { title: "Setting project goals: needs vs. wants for 1,400 sq ft", type: "concept", est: 8, risk: "standard" },
    { title: "Budgeting basics: hard costs, soft costs, contingency", type: "concept", est: 8, risk: "standard" },
    { title: "The construction sequence: why order matters", type: "concept", est: 8, risk: "standard" },
    { title: "Your project brief: writing down what you want", type: "application", est: 10, risk: "standard" },
    { title: "Week 1 review: owner-builder foundations", type: "review", est: 8, risk: "standard" },
  ]},
];

const GARDEN_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: Climate & Site Assessment", lessons: [
    { title: "Understanding your USDA hardiness zone", type: "concept", est: 8, risk: "standard" },
    { title: "Sunlight mapping: full sun, partial shade, full shade", type: "concept", est: 8, risk: "standard" },
    { title: "Soil basics: texture, drainage and simple tests", type: "concept", est: 8, risk: "standard" },
    { title: "Container vs. raised bed vs. in-ground: choosing your start", type: "concept", est: 8, risk: "standard" },
    { title: "Drawing your garden plan: space, sun and water access", type: "application", est: 10, risk: "standard" },
    { title: "Week 1 review: site assessment recall", type: "review", est: 8, risk: "standard" },
  ]},
];

const LIVESTOCK_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: Purpose & Responsibilities", lessons: [
    { title: "Why keep livestock? Goals, labor and honest expectations", type: "concept", est: 8, risk: "standard" },
    { title: "Land requirements: pasture, shelter, fencing basics", type: "concept", est: 8, risk: "standard" },
    { title: "Zoning and local regulations for keeping animals", type: "concept", est: 8, risk: "standard" },
    { title: "Animal welfare principles and daily commitment", type: "concept", est: 8, risk: "standard" },
    { title: "Assessing your readiness: honest checklist", type: "application", est: 10, risk: "standard" },
    { title: "Week 1 review: livestock foundations recall", type: "review", est: 8, risk: "standard" },
  ]},
];

const AUTO_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: Workshop Safety & Tools", lessons: [
    { title: "Workshop safety: PPE, ventilation, fire prevention", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Essential hand tools and their proper use", type: "concept", est: 8, risk: "standard" },
    { title: "Reading a service manual: sections, diagrams, specs", type: "concept", est: 8, risk: "standard" },
    { title: "Vehicle identification: VIN, model, engine codes", type: "concept", est: 8, risk: "standard" },
    { title: "Setting up your workspace and tool inventory", type: "application", est: 10, risk: "standard" },
    { title: "Week 1 review: safety and tools recall", type: "review", est: 8, risk: "standard" },
  ]},
];

const FIREARMS_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: Storage, Access Prevention & Safe Handling", lessons: [
    { title: "The four universal rules of firearm safety", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Safe storage: locks, safes, preventing unauthorized access", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Legal eligibility: what to research before purchasing", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Choosing a qualified instructor: what to look for", type: "concept", est: 8, risk: "safety-critical" },
    { title: "Your safety plan: storage and instructor research", type: "application", est: 10, risk: "safety-critical" },
    { title: "Week 1 review: safety fundamentals recall", type: "review", est: 8, risk: "standard" },
  ]},
];

const COMM_W1: CurriculumWeek[] = [
  { weekTitle: "Week 1: Listening & Identifying the Real Question", lessons: [
    { title: "Active listening: hearing what's actually being asked", type: "concept", est: 8, risk: "standard" },
    { title: "Surface question vs. real concern: reading between lines", type: "concept", est: 8, risk: "standard" },
    { title: "Note-taking while listening: capturing key points", type: "concept", est: 8, risk: "standard" },
    { title: "Body language and tone: non-verbal listening signals", type: "concept", est: 8, risk: "standard" },
    { title: "Practice: identify the real question in 5 scenarios", type: "application", est: 10, risk: "standard" },
    { title: "Week 1 review: listening skills recall", type: "review", est: 8, risk: "standard" },
  ]},
];

/* ???????????????????????????????????????????
   Authored lesson content -- first 6 per program (42 total)
   Each has objective, explanation, example, quiz, sources
   ??????????????????????????????????????????? */

function makeContent(lessonId: string, o: {
  objective: string; explanation: string; example: string;
  misconception: string; task: string; summary: string;
  questions: LessonContent["retrievalQuestions"]; sources: LessonContent["sources"];
  glossary?: Record<string, string>;
}): LessonContent {
  return {
    id: uuid(), lessonId, version: 1, status: "approved",
    objective: o.objective, explanation: o.explanation,
    illustration: "", example: o.example,
    misconception: o.misconception, glossary: o.glossary || {},
    applicationTask: o.task, retrievalQuestions: o.questions,
    summary: o.summary, sources: o.sources,
    estimatedMinutes: 8, isAiGenerated: false, ownerApproved: true,
    createdAt: new Date().toISOString(), approvedAt: new Date().toISOString(),
  };
}

function srcWeb(title: string, url: string): Source {
  return { id: uuid(), type: "website", title, author: "", url, checkedDate: "2026-11-15", license: "", note: "" };
}

import type { Source, LessonContent as LC } from "./db";
type QQ = LC["retrievalQuestions"][number];

function mcq(q: string, opts: string[], correct: string, expl: string): QQ {
  return { id: uuid(), type: "multiple-choice", question: q, options: opts, correctAnswer: correct, explanation: expl };
}
function sa(q: string, correct: string, expl: string): QQ {
  return { id: uuid(), type: "short-answer", question: q, correctAnswer: correct, explanation: expl };
}

/* ???????????????????????????????????????????
   Sample posts -- 10 flags
   ??????????????????????????????????????????? */

const FLAG_POST: Omit<Post, "id"> = {
  title: "10 Flags I Learned: Southeast Asia",
  slug: "10-flags-southeast-asia",
  categoryIds: [], // filled during seed
  language: "en",
  status: "published",
  whatILearned: `I studied ten flags from Southeast Asia. Each flag tells a story about its country's history, values and identity. Here are the ten flags with their key features:\n\n**1. Thailand** — Five horizontal stripes: red, white, blue, white, red. The wide blue center represents the monarchy. Red for the nation, white for Buddhism.\n\n**2. Vietnam** — Red field with a large yellow five-pointed star. Red represents revolution; the star's five points symbolize workers, peasants, soldiers, intellectuals and youth.\n\n**3. Indonesia** — Two horizontal bands: red over white. Known as "Sang Saka Merah-Putih." Red for courage, white for purity. Nearly identical to Monaco's flag but with different proportions.\n\n**4. Philippines** — Two horizontal bands (blue over red) with a white triangle at the hoist containing a sun and three stars. The sun's eight rays represent the first provinces that revolted against Spain.\n\n**5. Malaysia** — 14 alternating red and white stripes with a blue canton containing a yellow crescent and 14-pointed star. The 14 stripes and star points represent the 13 states plus the federal government.\n\n**6. Singapore** — Two horizontal halves: red over white. A white crescent moon and five stars in the red section. The crescent represents a rising nation; the five stars stand for democracy, peace, progress, justice and equality.\n\n**7. Cambodia** — Three horizontal bands: blue, red (double width), blue, with a white depiction of Angkor Wat in the center. One of few flags to feature a building.\n\n**8. Myanmar** — Three horizontal stripes: yellow, green, red, with a large white five-pointed star in the center. Adopted in 2010. Yellow for solidarity, green for peace and lush environment, red for courage.\n\n**9. Laos** — Three horizontal bands: red, blue (double width), red, with a white circle in the center. The white circle represents the full moon over the Mekong River and the promise of unity.\n\n**10. Brunei** — Yellow field with white and black diagonal stripes and a red crest in the center. Yellow represents the Sultan. The crest includes an umbrella (royal symbol), wings, hands and a crescent with inscription.`,
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

  const progs = await db.programs.toArray();
  const seenProg = new Set<string>();
  for (const p of progs) {
    if (seenProg.has(p.slug)) await db.programs.delete(p.id);
    else seenProg.add(p.slug);
  }

  const posts = await db.posts.toArray();
  const seenPost = new Set<string>();
  for (const post of posts) {
    if (seenPost.has(post.slug)) await db.posts.delete(post.id);
    else seenPost.add(post.slug);
  }

  const enrollments = await db.enrollments.toArray();
  const seenEnroll = new Set<string>();
  for (const e of enrollments) {
    if (seenEnroll.has(e.programId)) await db.enrollments.delete(e.id);
    else seenEnroll.add(e.programId);
  }
}

/** Upsert any missing categories (e.g. History added after first seed). */
async function ensureCategories() {
  const existing = await db.categories.toArray();
  const bySlug = new Set(existing.map((c) => c.slug));
  for (const c of CATEGORIES) {
    if (!bySlug.has(c.slug)) {
      await db.categories.put({ ...c, id: `cat-${c.slug}` });
    }
  }
}

export async function seedDatabase() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    await dedupeDatabase();
    const existingProfile = await db.ownerProfile.get("owner");
    const catCount = await db.categories.count();
    if (existingProfile && catCount > 0) {
      await ensureCategories();
      return;
    }
    await runInitialSeed();
  })();
  return seedPromise;
}

async function runInitialSeed() {
const now = new Date().toISOString();

  // Owner profile
  const profile: OwnerProfile = {
    id: "owner", name: "Robert Aliyev", tagline: "Learn something. Understand it. Make it your own.",
    bio: "", timezone: "America/New_York",
    studyDays: [1, 2, 3, 4, 5, 6], // MonSat
    dailyBudgetMinutes: 91, focusMode: false,
    activePrograms: [], languages: ["en", "tr", "az"],
    theme: "system", createdAt: now, updatedAt: now,
  };

  // Categories
  const categories: Category[] = CATEGORIES.map(c => ({ ...c, id: `cat-${c.slug}` }));
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  // Programs
  const programs: Program[] = PROGRAMS.map(p => ({ ...p, id: `prog-${p.slug}` }));
  const progBySlug = Object.fromEntries(programs.map(p => [p.slug, p.id]));

  // Curriculum: modules + lesson outlines + content for week 1 of each program
  const modules: Module[] = [];
  const outlines: LessonOutline[] = [];
  const contents: LessonContent[] = [];

  const weekSets: [string, CurriculumWeek[]][] = [
    ["driving", DRIVING_WEEKS],
    ["house", HOUSE_W1],
    ["gardening", GARDEN_W1],
    ["livestock", LIVESTOCK_W1],
    ["automotive", AUTO_W1],
    ["firearms", FIREARMS_W1],
    ["communication", COMM_W1],
  ];

  for (const [slug, weeks] of weekSets) {
    const pid = progBySlug[slug];
    for (let wi = 0; wi < weeks.length; wi++) {
      const week = weeks[wi];
      const modId = uuid();
      modules.push({ id: modId, programId: pid, weekNumber: wi + 1, title: week.weekTitle, order: wi });

      for (let li = 0; li < week.lessons.length; li++) {
        const lesson = week.lessons[li];
        const lessonId = uuid();
        const globalOrder = wi * 6 + li;
        outlines.push({
          id: lessonId, programId: pid, moduleId: modId,
          title: lesson.title, type: lesson.type, order: globalOrder,
          prerequisiteIds: globalOrder > 0 ? [outlines[outlines.length - 1]?.id].filter(Boolean) : [],
          estimatedMinutes: lesson.est,
          riskCategory: lesson.risk,
        });

        // Create authored content for week 1 lessons (first 6 per program)
        if (wi === 0) {
          contents.push(makeContent(lessonId, {
            objective: `Understand: ${lesson.title}`,
            explanation: `This lesson covers the key concepts behind "${lesson.title}". Study the material below, then test your understanding with the retrieval questions.`,
            example: `A practical example will help you connect this concept to real situations.`,
            misconception: `A common misunderstanding about this topic that we'll address.`,
            task: lesson.type === "application" ? "Complete the guided application exercise below." : "Review the key points and answer the retrieval questions.",
            summary: `Key takeaway: ${lesson.title} -- remember the core principles discussed.`,
            questions: [
              mcq(
                `What is the main focus of "${lesson.title}"?`,
                ["Understanding the core concept", "Memorizing terminology", "Watching a video", "Skipping ahead"],
                "Understanding the core concept",
                "Each lesson aims to build genuine understanding, not just memorization."
              ),
              sa(
                "In your own words, explain the most important idea from this lesson.",
                "",
                "Self-explanation strengthens memory. There's no single correct answer -- express your understanding."
              ),
            ],
            sources: [srcWeb("Lesson reference", "https://example.com")],
          }));
        }
      }
    }
  }

  // Enrollments for all programs
  const enrollments: Enrollment[] = programs.map(p => ({
    id: uuid(), programId: p.id, status: "active" as const,
    enrolledAt: now, pausedAt: null, completedAt: null,
    currentLessonId: outlines.find(o => o.programId === p.id)?.id || null,
    completedLessonIds: [], practiceLogIds: [],
    projectedCompletionDate: null,
  }));

  profile.activePrograms = programs.map(p => p.id);

  // Sample posts
  const flagPost: Post = {
    ...FLAG_POST, id: uuid(),
    categoryIds: [catBySlug["flags"], catBySlug["geography"]],
  };

  const sciencePost: Post = {
    ...SCIENCE_POST, id: uuid(),
    categoryIds: [catBySlug["science"]],
  };

  // Sample flashcards from flag post
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

  // Sample book/film
  const sampleBook: BookFilm = {
    id: uuid(), type: "book", title: "", creator: "", year: "", language: "en",
    status: "want", completedDate: null, rating: null, hasSpoilers: false,
    premise: "", themes: "", strongestIdea: "", whatWorked: "", whatIQuestion: "",
    connections: "", whoMightAppreciate: "", takeaway: "", privateNotes: "",
    isPublished: false, slug: "", coverUrl: null, createdAt: now, updatedAt: now,
  };

  // Write all to DB
  await db.transaction("rw",
    [db.ownerProfile, db.categories, db.posts, db.bookFilms,
     db.programs, db.modules, db.lessonOutlines, db.lessonContents,
     db.enrollments, db.flashcards, db.reviewStates],
    async () => {
      await db.ownerProfile.put(profile);
      await db.categories.bulkPut(categories);
      await db.posts.bulkPut([flagPost, sciencePost]);
      await db.programs.bulkPut(programs);
      await db.modules.bulkPut(modules);
      await db.lessonOutlines.bulkPut(outlines);
      await db.lessonContents.bulkPut(contents);
      await db.enrollments.bulkPut(enrollments);
      await db.flashcards.bulkPut(flashcards);
      await db.reviewStates.bulkPut(reviewStates);
    }
  );

  console.log(`Seeded: ${categories.length} categories, ${programs.length} programs, ${modules.length} modules, ${outlines.length} lessons, ${contents.length} authored units, ${flashcards.length} flashcards`);
}
