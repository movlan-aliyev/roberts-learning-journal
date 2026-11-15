"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type Program } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillPoster } from "@/components/visuals/CategoryVisual";
import { ArrowRight, BookOpen } from "lucide-react";

export default function SkillsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    db.programs.orderBy("order").toArray().then((rows) => {
      const seen = new Set<string>();
      setPrograms(rows.filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true))));
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Skills</h1>
        <p className="text-muted dark:text-muted-dark max-w-2xl">
          Seven practical skill programs with short daily theory and separate supervised practice.
          Study estimates are literacy roadmaps, not professional licenses. Anyone can browse the
          curriculum and visuals; private study progress stays with the owner.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <Card key={prog.id} padding="none" className="overflow-hidden flex flex-col">
            <SkillPoster slug={prog.slug} className="!my-0 rounded-none" />
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-serif text-lg font-semibold">{prog.name}</h2>
                <Badge color={prog.color}>{prog.durationWeeks} wk</Badge>
              </div>
              <p className="text-sm text-muted dark:text-muted-dark mb-3 flex-1">{prog.description}</p>
              <p className="text-xs text-muted mb-4">
                {prog.totalUnits} units - {prog.weeklyPattern}
              </p>
              <Link href={`/skills/${prog.slug}`}>
                <Button variant="secondary" size="sm" className="w-full">
                  View curriculum <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <Card padding="lg" className="text-center text-muted">Loading skill programs...</Card>
      )}

      <Card padding="lg" className="mt-10 text-center">
        <BookOpen size={28} className="text-teal mx-auto mb-3" />
        <h2 className="font-serif text-xl font-semibold mb-2">Free to study</h2>
        <p className="text-sm text-muted dark:text-muted-dark max-w-xl mx-auto mb-4">
          Browse every skill, open lessons, take quizzes, and use spaced review -- no account, no paywall.
        </p>
        <Link href="/learn/today">
          <Button size="sm">Start studying <ArrowRight size={14} /></Button>
        </Link>
      </Card>
    </div>
  );
}
