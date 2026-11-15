"use client";
import { useEffect, useState, useCallback } from "react";
import { db, type Flashcard, type ReviewState } from "@/lib/db";
import { getDueCards, reviewCard } from "@/lib/spaced-repetition";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Eye, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  return <OwnerGuard><ReviewContent /></OwnerGuard>;
}

function ReviewContent() {
  const [dueIds, setDueIds] = useState<string[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function loadDue() {
      const ids = await getDueCards();
      setDueIds(ids);
      const allCards = ids.length > 0
        ? await db.flashcards.where("id").anyOf(ids).toArray()
        : [];
      setCards(allCards);
      setCurrent(0);
      setShowAnswer(false);
      setReviewed(0);
      setDone(ids.length === 0);
    }
    loadDue();
  }, []);

  const handleRate = useCallback(async (rating: "again" | "hard" | "good" | "easy") => {
    const card = cards[current];
    if (!card) return;
    await reviewCard(card.id, rating);
    setReviewed(r => r + 1);
    if (current + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setShowAnswer(false);
    }
  }, [cards, current]);

  if (done) return (
    <div className="max-w-lg mx-auto px-[var(--spacing-page)] py-16 text-center">
      <CheckCircle size={48} className="text-success mx-auto mb-4" />
      <h1 className="font-serif text-2xl font-bold mb-2">
        {reviewed > 0 ? "Review Complete!" : "All caught up!"}
      </h1>
      <p className="text-muted dark:text-muted-dark mb-6">
        {reviewed > 0 ? `You reviewed ${reviewed} cards.` : "No cards are due for review right now."}
      </p>
      <Link href="/learn/today"><Button>Back to Today</Button></Link>
    </div>
  );

  const card = cards[current];
  if (!card) return null;

  return (
    <div className="max-w-lg mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
          <RotateCcw size={22} className="text-gold" /> Spaced Review
        </h1>
        <span className="text-sm text-muted">{current + 1} / {cards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border dark:bg-border-dark rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${((current) / cards.length) * 100}%` }} />
      </div>

      <Card padding="lg" className="mb-6">
        {/* Front */}
        <div className="text-center py-4">
          <p className="text-lg font-medium">{card.front}</p>
        </div>

        {/* Answer */}
        {!showAnswer ? (
          <div className="text-center pt-4 border-t border-border dark:border-border-dark">
            <Button onClick={() => setShowAnswer(true)} variant="secondary">
              <Eye size={16} /> Show Answer
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t border-border dark:border-border-dark">
            <div className="text-center py-4 mb-4">
              <p className="text-lg font-semibold text-teal">{card.back}</p>
            </div>

            <p className="text-sm text-center text-muted mb-3">How well did you remember?</p>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="danger" size="sm" onClick={() => handleRate("again")}>
                Again
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleRate("hard")} className="border-warning text-warning">
                Hard
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleRate("good")} className="border-success text-success">
                Good
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleRate("easy")}>
                Easy
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-1 text-xs text-center text-muted">
              <span>1d</span><span>same</span><span>next</span><span>skip</span>
            </div>
          </div>
        )}
      </Card>

      <div className="flex gap-2 text-sm text-muted">
        {card.tags.length > 0 && <span>Tags: {card.tags.join(", ")}</span>}
      </div>
    </div>
  );
}
