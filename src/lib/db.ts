import Dexie, { type Table } from "dexie";

/* ??? Entity types ??? */

export interface OwnerProfile {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  timezone: string;
  studyDays: number[]; // 0=Sun..6=Sat
  dailyBudgetMinutes: number;
  focusMode: boolean;
  activePrograms: string[];
  languages: string[];
  theme: "light" | "dark" | "system";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  order: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  categoryIds: string[];
  language: string;
  status: "draft" | "published" | "archived";
  whatILearned: string;
  myPerspective: string;
  exampleThatClicked: string;
  stillWantToUnderstand: string;
  glossary: Record<string, { en?: string; tr?: string; az?: string }>;
  sources: Source[];
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  isAiGenerated: boolean;
  ownerApproved: boolean;
}

export interface PostRevision {
  id: string;
  postId: string;
  content: string; // JSON snapshot
  createdAt: string;
}

export interface Source {
  id: string;
  type: "book" | "website" | "video" | "paper" | "manual" | "official" | "other";
  title: string;
  author: string;
  url: string;
  checkedDate: string;
  license: string;
  note: string;
}

export interface BookFilm {
  id: string;
  type: "book" | "film";
  title: string;
  creator: string;
  year: string;
  language: string;
  status: "want" | "reading" | "watching" | "completed" | "abandoned";
  completedDate: string | null;
  rating: number | null;
  hasSpoilers: boolean;
  premise: string;
  themes: string;
  strongestIdea: string;
  whatWorked: string;
  whatIQuestion: string;
  connections: string;
  whoMightAppreciate: string;
  takeaway: string;
  privateNotes: string;
  isPublished: boolean;
  slug: string;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationWeeks: number;
  totalUnits: number;
  weeklyPattern: string; // "4 concepts + application + review"
  icon: string;
  color: string;
  order: number;
}

export interface Module {
  id: string;
  programId: string;
  weekNumber: number;
  title: string;
  order: number;
}

export interface LessonOutline {
  id: string;
  programId: string;
  moduleId: string;
  title: string;
  type: "concept" | "application" | "review";
  order: number;
  prerequisiteIds: string[];
  estimatedMinutes: number;
  riskCategory: "standard" | "safety-critical" | "professional-review";
}

export interface LessonContent {
  id: string;
  lessonId: string;
  version: number;
  status: "draft" | "approved" | "needs_review" | "rejected";
  objective: string;
  explanation: string;
  illustration: string;
  example: string;
  misconception: string;
  glossary: Record<string, string>;
  applicationTask: string;
  retrievalQuestions: QuizQuestion[];
  summary: string;
  sources: Source[];
  estimatedMinutes: number;
  isAiGenerated: boolean;
  ownerApproved: boolean;
  createdAt: string;
  approvedAt: string | null;
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "short-answer" | "visual-id" | "ordering" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  image?: string;
}

export interface Enrollment {
  id: string;
  programId: string;
  status: "active" | "paused" | "completed";
  enrolledAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  currentLessonId: string | null;
  completedLessonIds: string[];
  practiceLogIds: string[];
  projectedCompletionDate: string | null;
}

export interface DailyAssignment {
  id: string;
  date: string; // YYYY-MM-DD local
  programId: string;
  lessonId: string;
  lessonContentVersion: number;
  status: "assigned" | "in-progress" | "completed" | "skipped";
  startedAt: string | null;
  completedAt: string | null;
}

export interface LearningEvent {
  id: string;
  lessonId: string;
  assignmentId: string | null;
  type: "read" | "attempted" | "passed-theory" | "practical-evidence";
  answers: Record<string, string>;
  score: number | null;
  timeSpentMinutes: number;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  postId: string | null;
  lessonId: string | null;
  front: string;
  back: string;
  tags: string[];
  createdAt: string;
}

export interface ReviewState {
  id: string;
  flashcardId: string;
  interval: number; // days
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewDate: string | null;
  reviewCount: number;
  status: "new" | "learning" | "review" | "graduated";
}

export interface ReviewEvent {
  id: string;
  flashcardId: string;
  rating: "again" | "hard" | "good" | "easy";
  previousInterval: number;
  newInterval: number;
  reviewedAt: string;
}

export interface AutomationRun {
  id: string;
  type: "daily-prep" | "content-generation" | "manual";
  status: "running" | "completed" | "failed" | "partial";
  startedAt: string;
  completedAt: string | null;
  assignmentsCreated: number;
  errors: string[];
  deduplicationKey: string;
}

/* ??? Dexie database ??? */

export class LearningDB extends Dexie {
  ownerProfile!: Table<OwnerProfile>;
  categories!: Table<Category>;
  posts!: Table<Post>;
  postRevisions!: Table<PostRevision>;
  bookFilms!: Table<BookFilm>;
  programs!: Table<Program>;
  modules!: Table<Module>;
  lessonOutlines!: Table<LessonOutline>;
  lessonContents!: Table<LessonContent>;
  enrollments!: Table<Enrollment>;
  dailyAssignments!: Table<DailyAssignment>;
  learningEvents!: Table<LearningEvent>;
  flashcards!: Table<Flashcard>;
  reviewStates!: Table<ReviewState>;
  reviewEvents!: Table<ReviewEvent>;
  automationRuns!: Table<AutomationRun>;

  constructor() {
    super("RobertsLearningJournal");
    this.version(1).stores({
      ownerProfile: "id",
      categories: "id, slug, order",
      posts: "id, slug, status, *categoryIds, publishedAt, createdAt",
      postRevisions: "id, postId, createdAt",
      bookFilms: "id, slug, type, status, isPublished",
      programs: "id, slug, order",
      modules: "id, programId, weekNumber, order",
      lessonOutlines: "id, programId, moduleId, order, *prerequisiteIds",
      lessonContents: "id, lessonId, version, status",
      enrollments: "id, programId, status",
      dailyAssignments: "id, date, programId, [date+programId], status",
      learningEvents: "id, lessonId, assignmentId, createdAt",
      flashcards: "id, postId, lessonId, *tags",
      reviewStates: "id, flashcardId, nextReviewDate, status",
      reviewEvents: "id, flashcardId, reviewedAt",
      automationRuns: "id, type, status, deduplicationKey, startedAt",
    });
  }
}

export const db = new LearningDB();
