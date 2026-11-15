"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import { db, type LessonOutline, type LessonContent, type LearningEvent, type Flashcard, type ReviewState } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ArrowLeft, CheckCircle, BookOpen, HelpCircle, Lightbulb, AlertTriangle, ClipboardList, Lock } from "lucide-react";
import { SkillPoster } from "@/components/visuals/CategoryVisual";

const TYPE_LABEL: Record<string, string> = {
  concept: "Learn",
  application: "Try it",
  review: "Check",
};

/** Guests may read lessons. Only the owner can complete, save progress, or run Study. */
export default function LessonPage() {
  return <LessonPlayer />;
}

function LessonPlayer() {
  const { isOwner } = useAuth();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id") || "";

  const [outline, setOutline] = useState<LessonOutline | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [programSlug, setProgramSlug] = useState<string>("");
  const [step, setStep] = useState<"learn" | "quiz" | "results">("learn");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());
  const [selfNote, setSelfNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    db.lessonOutlines.get(lessonId).then(async o => {
      setOutline(o || null);
      if (o) {
        const prog = await db.programs.get(o.programId);
        if (prog) setProgramSlug(prog.slug);
      }
    });
    db.lessonContents.where("lessonId").equals(lessonId).and(c => c.status === "approved").first().then(c => setContent(c || null));
  }, [lessonId]);

  const completeLesson = useCallback(async () => {
    if (!outline || !content) return;
    if (!isOwner) {
      setStep("results");
      return;
    }
    const score = calculateScore();
    const event: LearningEvent = {
      id: uuid(), lessonId: outline.id, assignmentId: null,
      type: score !== null && score >= 70 ? "passed-theory" : "attempted",
      answers, score, timeSpentMinutes: content.estimatedMinutes,
      createdAt: new Date().toISOString(),
    };
    await db.learningEvents.add(event);

    const enrollment = await db.enrollments.where("programId").equals(outline.programId).first();
    if (enrollment) {
      const completedIds = [...new Set([...enrollment.completedLessonIds, outline.id])];
      const nextLesson = await db.lessonOutlines
        .where("programId").equals(outline.programId)
        .and(l => !completedIds.includes(l.id) && l.order > outline.order)
        .sortBy("order");

      await db.enrollments.update(enrollment.id, {
        completedLessonIds: completedIds,
        currentLessonId: nextLesson[0]?.id || null,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const assignment = await db.dailyAssignments
      .where("[date+programId]").equals([today, outline.programId]).first();
    if (assignment) {
      await db.dailyAssignments.update(assignment.id, { status: "completed", completedAt: new Date().toISOString() });
    }

    setStep("results");
  }, [outline, content, answers, isOwner]);

  function calculateScore(): number | null {
    if (!content) return null;
    const mcqs = content.retrievalQuestions.filter(q => q.type === "multiple-choice");
    if (mcqs.length === 0) return null;
    let correct = 0;
    mcqs.forEach(q => { if (answers[q.id] === q.correctAnswer) correct++; });
    return Math.round((correct / mcqs.length) * 100);
  }

  async function saveFlashcards() {
    if (!isOwner || !content || !outline) return;
    const now = new Date().toISOString();
    const cards: Flashcard[] = content.retrievalQuestions.slice(0, 3).map(q => ({
      id: uuid(), postId: null, lessonId: outline.id,
      front: q.question, back: q.correctAnswer || q.explanation,
      tags: [outline.programId], createdAt: now,
    }));
    const states: ReviewState[] = cards.map(c => ({
      id: uuid(), flashcardId: c.id, interval: 1, easeFactor: 2.5,
      nextReviewDate: new Date().toISOString().split("T")[0],
      lastReviewDate: null, reviewCount: 0, status: "new" as const,
    }));
    await db.transaction("rw", [db.flashcards, db.reviewStates], async () => {
      await db.flashcards.bulkAdd(cards);
      await db.reviewStates.bulkAdd(states);
    });
    setSaved(true);
  }

  if (!outline) return <div className="max-w-3xl mx-auto p-8 text-center text-muted">Lesson not found.</div>;
  if (!content) return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8 text-center">
      <Card padding="lg">
        <AlertTriangle size={32} className="text-warning mx-auto mb-3" />
        <h2 className="font-serif text-xl font-semibold mb-2">Coming soon</h2>
        <p className="text-muted">This lesson is not written yet. Check back when Robert adds it.</p>
        <Link href="/" className="text-teal hover:underline block mt-4">Back home</Link>
      </Card>
    </div>
  );

  const backHref = isOwner ? "/learn/today" : "/";

  return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> {isOwner ? "Back to Study" : "Back to skill"}
      </Link>

      {!isOwner && (
        <Card padding="sm" className="mb-4 flex items-start gap-2 bg-ink/[0.03] dark:bg-white/[0.04]">
          <Lock size={14} className="text-muted mt-0.5 shrink-0" />
          <p className="text-xs text-muted">
            You can read this lesson. Saving progress, flashcards, and Study are locked to the owner so the public site stays clean.
          </p>
        </Card>
      )}

      <header className="mb-6">
        <div className="flex gap-2 mb-2 flex-wrap">
          <Badge color={outline.type === "concept" ? "#167D8D" : outline.type === "application" ? "#B28B4B" : "#8e44ad"}>
            {TYPE_LABEL[outline.type] || outline.type}
          </Badge>
          <Badge color="#6b6560">~{content.estimatedMinutes} min</Badge>
          {outline.riskCategory === "safety-critical" && <Badge color="#c0392b">Be careful</Badge>}
        </div>
        <h1 className="font-serif text-2xl font-bold">{outline.title}</h1>
        <p className="text-sm text-teal mt-1">{content.objective}</p>
      </header>

      {step === "learn" && (
        <div className="space-y-6">
          {programSlug && <SkillPoster slug={programSlug} />}

          <section>
            <h2 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-teal" /> Plain explanation
            </h2>
            <div className="prose whitespace-pre-wrap text-[15px] leading-relaxed">{content.explanation}</div>
          </section>

          {content.example && (
            <Card padding="md" className="border-l-4 border-l-gold bg-gold/5">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gold mb-2 flex items-center gap-1">
                <Lightbulb size={14} /> Picture this
              </h3>
              <p className="leading-relaxed">{content.example}</p>
            </Card>
          )}

          {content.misconception && (
            <Card padding="md" className="border-l-4 border-l-danger bg-danger/5">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-danger mb-2 flex items-center gap-1">
                <AlertTriangle size={14} /> Easy mistake
              </h3>
              <p className="leading-relaxed">{content.misconception}</p>
            </Card>
          )}

          {Object.keys(content.glossary).length > 0 && (
            <section>
              <h3 className="font-semibold text-sm mb-2">Words to know</h3>
              <div className="grid gap-1">
                {Object.entries(content.glossary).map(([term, def]) => (
                  <div key={term} className="flex gap-2 text-sm">
                    <span className="font-semibold text-teal">{term}:</span>
                    <span className="text-muted">{def}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {content.applicationTask && (
            <Card padding="md" className="bg-teal/5">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <ClipboardList size={14} className="text-teal" /> Your turn
              </h3>
              <p className="text-sm leading-relaxed">{content.applicationTask}</p>
            </Card>
          )}

          {/* Sources */}
          {content.sources.length > 0 && (
            <section className="text-sm">
              <h3 className="font-semibold mb-2">Sources</h3>
              <ul className="space-y-1 text-muted">
                {content.sources.map((s, i) => (
                  <li key={i}>{s.title} {s.url && <a href={s.url} className="text-teal hover:underline" target="_blank" rel="noopener noreferrer">[link]</a>}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setStep("quiz")} className="flex-1">
              <HelpCircle size={16} /> Test My Understanding
            </Button>
          </div>
        </div>
      )}

      {step === "quiz" && (
        <div className="space-y-6">
          <h2 className="font-serif text-lg font-semibold">Retrieval Questions</h2>
          <p className="text-sm text-muted">Try to answer from memory before revealing explanations.</p>

          {content.retrievalQuestions.map((q, qi) => (
            <Card key={q.id} padding="md">
              <p className="font-medium mb-3">{qi + 1}. {q.question}</p>

              {q.type === "multiple-choice" && q.options && (
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? "bg-teal/10 border border-teal/30" : "hover:bg-ink/3"}`}>
                      <input
                        type="radio" name={q.id} value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                        className="accent-teal"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "short-answer" && (
                <Textarea
                  value={answers[q.id] || ""}
                  onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                  placeholder="Write your answer..."
                  className="min-h-[80px]"
                />
              )}

              <button
                onClick={() => setShowExplanations(prev => { const n = new Set(prev); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}
                className="text-sm text-teal hover:underline mt-3"
              >
                {showExplanations.has(q.id) ? "Hide explanation" : "Reveal explanation"}
              </button>
              {showExplanations.has(q.id) && (
                <Card padding="sm" className="mt-2 bg-teal/5 text-sm">
                  {q.correctAnswer && <p><strong>Answer:</strong> {q.correctAnswer}</p>}
                  <p className="text-muted mt-1">{q.explanation}</p>
                </Card>
              )}
            </Card>
          ))}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep("learn")}>Back to lesson</Button>
            <Button onClick={completeLesson} className="flex-1">
              <CheckCircle size={16} /> {isOwner ? "Complete lesson" : "Finish reading"}
            </Button>
          </div>
        </div>
      )}

      {step === "results" && (
        <div className="space-y-6 text-center">
          <CheckCircle size={48} className="text-success mx-auto" />
          <h2 className="font-serif text-2xl font-bold">{isOwner ? "Lesson complete!" : "Nice work reading"}</h2>
          {calculateScore() !== null && (
            <p className="text-lg">Score: <strong className="text-teal">{calculateScore()}%</strong></p>
          )}

          {isOwner ? (
            <>
              <Card padding="md" className="text-left">
                <h3 className="font-semibold text-sm mb-2">Explain in your own words</h3>
                <Textarea
                  value={selfNote}
                  onChange={e => setSelfNote(e.target.value)}
                  placeholder="What was the most important thing you learned?"
                />
              </Card>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="secondary" onClick={saveFlashcards} disabled={saved}>
                  {saved ? "Cards saved" : "Save flashcards for review"}
                </Button>
                <Link href="/learn/today"><Button>Back to Study</Button></Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={backHref}><Button variant="secondary">More lessons</Button></Link>
              <Link href="/learn/review"><Button>Try Review</Button></Link>
            </div>
          )}
        </div>
      )}

      {/* Summary bar */}
      {step !== "results" && (
        <div className="sticky bottom-4 mt-8">
          <Card padding="sm" className="flex items-center justify-between bg-paper/95 dark:bg-paper-dark/95 backdrop-blur shadow-lg">
            <span className="text-sm text-muted">{content.summary}</span>
            <span className="text-xs text-muted">{step === "learn" ? "Study" : "Quiz"}</span>
          </Card>
        </div>
      )}
    </div>
  );
}
