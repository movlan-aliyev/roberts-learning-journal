"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type Program, type Enrollment } from "@/lib/db";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pause, Play } from "lucide-react";
import { SkillPoster } from "@/components/visuals/CategoryVisual";

export default function ProgramsPage() {
  return <OwnerGuard><ProgramsContent /></OwnerGuard>;
}

function ProgramsContent() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    db.programs.orderBy("order").toArray().then((rows) => {
      const seen = new Set<string>();
      setPrograms(rows.filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true))));
    });
    db.enrollments.toArray().then((rows) => {
      const seen = new Set<string>();
      setEnrollments(rows.filter((e) => (seen.has(e.programId) ? false : (seen.add(e.programId), true))));
    });
  }, []);

  async function togglePause(enrollmentId: string) {
    const e = await db.enrollments.get(enrollmentId);
    if (!e) return;
    const updated = {
      ...e,
      status: (e.status === "paused" ? "active" : "paused") as Enrollment["status"],
      pausedAt: e.status === "paused" ? null : new Date().toISOString(),
    };
    await db.enrollments.put(updated);
    db.enrollments.toArray().then(setEnrollments);
  }

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Skills &amp; Programs</h1>
          <p className="text-muted dark:text-muted-dark">Structured study tracks with illustrated lessons</p>
        </div>
        <Link href="/skills" className="text-sm text-teal hover:underline">Public skills page →</Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {programs.map(prog => {
          const enrollment = enrollments.find(e => e.programId === prog.id);
          const completed = enrollment?.completedLessonIds.length || 0;
          const progress = Math.round((completed / prog.totalUnits) * 100);

          return (
            <Card key={prog.id} padding="none" className="flex flex-col overflow-hidden">
              <SkillPoster slug={prog.slug} className="!my-0 rounded-none" />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-serif text-lg font-semibold">{prog.name}</h2>
                    <p className="text-xs text-muted">{prog.durationWeeks} weeks · {prog.totalUnits} units</p>
                  </div>
                  {enrollment && (
                    <Badge color={enrollment.status === "active" ? "#2d8a4e" : enrollment.status === "paused" ? "#c27c0e" : "#167D8D"}>
                      {enrollment.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted dark:text-muted-dark mb-3 flex-1">{prog.description}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>{completed}/{prog.totalUnits} completed</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-border dark:bg-border-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: prog.color }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/learn/programs/${prog.slug}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">View program</Button>
                  </Link>
                  {enrollment && (
                    <Button variant="ghost" size="sm" onClick={() => togglePause(enrollment.id)}>
                      {enrollment.status === "paused" ? <Play size={14} /> : <Pause size={14} />}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
