import { db, type DailyAssignment, type AutomationRun } from "./db";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";

/**
 * Daily lesson preparation -- idempotent.
 * Assigns the next eligible lesson for each active program.
 * If assignments already exist for today+program, reuses them (no duplicates).
 * Can be called from the browser or from a Node script / GitHub Action.
 */
export async function prepareDailyLessons(): Promise<AutomationRun> {
  const runId = uuid();
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const deduplicationKey = `daily-prep-${today}`;

  // Check for existing run today
  const existingRun = await db.automationRuns
    .where("deduplicationKey").equals(deduplicationKey)
    .and(r => r.status === "completed")
    .first();

  if (existingRun) {
    return existingRun; // idempotent
  }

  const run: AutomationRun = {
    id: runId, type: "daily-prep", status: "running",
    startedAt: now.toISOString(), completedAt: null,
    assignmentsCreated: 0, errors: [], deduplicationKey,
  };
  await db.automationRuns.add(run);

  try {
    const profile = await db.ownerProfile.get("owner");
    if (!profile) throw new Error("No owner profile found");

    // Check if today is a study day
    const dayOfWeek = now.getDay();
    if (!profile.studyDays.includes(dayOfWeek)) {
      run.status = "completed";
      run.completedAt = new Date().toISOString();
      run.errors.push("Not a study day -- no assignments created");
      await db.automationRuns.put(run);
      return run;
    }

    // Get active enrollments
    const enrollments = await db.enrollments.where("status").equals("active").toArray();
    let created = 0;

    for (const enrollment of enrollments) {
      try {
        // Check if assignment already exists for today + program
        const existing = await db.dailyAssignments
          .where("[date+programId]")
          .equals([today, enrollment.programId])
          .first();

        if (existing) {
          // Reuse existing -- idempotent
          continue;
        }

        // If previous lesson is incomplete, assign it again (Continue)
        if (enrollment.currentLessonId) {
          const prevAssignment = await db.dailyAssignments
            .where("programId").equals(enrollment.programId)
            .and(a => a.lessonId === enrollment.currentLessonId && a.status !== "completed")
            .first();

          const lessonId = enrollment.currentLessonId;

          // Check lesson has approved content
          const content = await db.lessonContents
            .where("lessonId").equals(lessonId)
            .and(c => c.status === "approved")
            .first();

          if (!content) {
            run.errors.push(`No approved content for lesson ${lessonId} in program ${enrollment.programId}`);
            continue;
          }

          const assignment: DailyAssignment = {
            id: uuid(), date: today,
            programId: enrollment.programId,
            lessonId, lessonContentVersion: content.version,
            status: "assigned", startedAt: null, completedAt: null,
          };

          await db.dailyAssignments.add(assignment);
          created++;
        }
      } catch (err) {
        run.errors.push(`Program ${enrollment.programId}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    run.assignmentsCreated = created;
    run.status = run.errors.length > 0 && created === 0 ? "partial" : "completed";
    run.completedAt = new Date().toISOString();
    await db.automationRuns.put(run);

    return run;
  } catch (err) {
    run.status = "failed";
    run.completedAt = new Date().toISOString();
    run.errors.push(err instanceof Error ? err.message : "Unknown error");
    await db.automationRuns.put(run);
    return run;
  }
}
