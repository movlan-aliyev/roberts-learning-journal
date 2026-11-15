import { db, type ReviewState, type ReviewEvent } from "./db";
import { v4 as uuid } from "uuid";
import { format, addDays } from "date-fns";

/**
 * Spaced repetition scheduler.
 * Intervals: 1, 3, 7, 14, 30, 60 days after successful recall, configurable.
 * "Again" ? 1 day; "Hard" ? grow slowly; "Good" ? advance; "Easy" ? skip one interval.
 */

const DEFAULT_INTERVALS = [1, 3, 7, 14, 30, 60];

function nextInterval(
  current: number,
  rating: "again" | "hard" | "good" | "easy",
  intervals = DEFAULT_INTERVALS,
): number {
  const idx = intervals.indexOf(current);
  switch (rating) {
    case "again": return intervals[0];
    case "hard": return idx >= 0 ? intervals[Math.min(idx, intervals.length - 1)] : intervals[0];
    case "good": return idx >= 0 ? intervals[Math.min(idx + 1, intervals.length - 1)] : intervals[1] || intervals[0];
    case "easy": return idx >= 0 ? intervals[Math.min(idx + 2, intervals.length - 1)] : intervals[2] || intervals[0];
  }
}

function nextStatus(state: ReviewState["status"], rating: "again" | "hard" | "good" | "easy"): ReviewState["status"] {
  if (rating === "again") return "learning";
  if (state === "new") return "learning";
  return "review";
}

export async function reviewCard(
  flashcardId: string,
  rating: "again" | "hard" | "good" | "easy",
  today?: string,
): Promise<ReviewState> {
  const todayStr = today || format(new Date(), "yyyy-MM-dd");
  let state = await db.reviewStates.where("flashcardId").equals(flashcardId).first();

  if (!state) {
    state = {
      id: uuid(), flashcardId, interval: 1, easeFactor: 2.5,
      nextReviewDate: todayStr, lastReviewDate: null,
      reviewCount: 0, status: "new",
    };
  }

  const previousInterval = state.interval;
  const newInterval = nextInterval(state.interval, rating);
  const newNextDate = format(addDays(new Date(todayStr), newInterval), "yyyy-MM-dd");

  const updated: ReviewState = {
    ...state,
    interval: newInterval,
    nextReviewDate: newNextDate,
    lastReviewDate: todayStr,
    reviewCount: state.reviewCount + 1,
    status: nextStatus(state.status, rating),
  };

  const event: ReviewEvent = {
    id: uuid(), flashcardId, rating,
    previousInterval, newInterval,
    reviewedAt: new Date().toISOString(),
  };

  await db.transaction("rw", [db.reviewStates, db.reviewEvents], async () => {
    await db.reviewStates.put(updated);
    await db.reviewEvents.add(event);
  });

  return updated;
}

export async function getDueCards(today?: string, limit = 50): Promise<string[]> {
  const todayStr = today || format(new Date(), "yyyy-MM-dd");
  const states = await db.reviewStates
    .where("nextReviewDate")
    .belowOrEqual(todayStr)
    .limit(limit)
    .toArray();
  return states.map(s => s.flashcardId);
}

export async function getDueCount(today?: string): Promise<number> {
  const todayStr = today || format(new Date(), "yyyy-MM-dd");
  return db.reviewStates.where("nextReviewDate").belowOrEqual(todayStr).count();
}
