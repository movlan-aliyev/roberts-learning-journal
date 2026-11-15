"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db, type Program, type Module, type LessonOutline, type Enrollment } from "@/lib/db";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, CheckCircle, Circle, Lock, PlayCircle } from "lucide-react";

export default function ProgramDetailPage() {
  return <OwnerGuard><ProgramDetail /></OwnerGuard>;
}

function ProgramDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<LessonOutline[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!slug) return;
    db.programs.where("slug").equals(slug).first().then(async p => {
      if (!p) return;
      setProgram(p);
      const mods = await db.modules.where("programId").equals(p.id).sortBy("order");
      setModules(mods);
      const lsns = await db.lessonOutlines.where("programId").equals(p.id).sortBy("order");
      setLessons(lsns);
      const enr = await db.enrollments.where("programId").equals(p.id).first();
      setEnrollment(enr || null);
    });
  }, [slug]);

  if (!program) return <div className="max-w-3xl mx-auto p-8 text-center text-muted">Loading...</div>;

  const completedIds = new Set(enrollment?.completedLessonIds || []);
  const currentId = enrollment?.currentLessonId;

  return (
    <div className="max-w-4xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href="/learn/programs" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> All programs
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{program.icon}</span>
        <div>
          <h1 className="font-serif text-2xl font-bold">{program.name}</h1>
          <p className="text-sm text-muted dark:text-muted-dark">{program.durationWeeks} weeks - {program.totalUnits} units</p>
        </div>
      </div>

      <div className="space-y-6">
        {modules.map(mod => {
          const modLessons = lessons.filter(l => l.moduleId === mod.id);
          return (
            <Card key={mod.id} padding="md">
              <h2 className="font-serif text-lg font-semibold mb-3">{mod.title}</h2>
              <div className="space-y-2">
                {modLessons.map(lesson => {
                  const isCompleted = completedIds.has(lesson.id);
                  const isCurrent = lesson.id === currentId;
                  const hasContent = true; // week 1 lessons have content
                  const isLocked = !isCompleted && !isCurrent && lesson.order > 0;

                  return (
                    <div key={lesson.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrent ? "bg-teal/10 border border-teal/30" : isCompleted ? "bg-success/5" : "hover:bg-ink/3"}`}>
                      {isCompleted ? (
                        <CheckCircle size={18} className="text-success flex-shrink-0" />
                      ) : isCurrent ? (
                        <PlayCircle size={18} className="text-teal flex-shrink-0" />
                      ) : isLocked ? (
                        <Lock size={18} className="text-muted flex-shrink-0" />
                      ) : (
                        <Circle size={18} className="text-muted flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        {isCurrent || isCompleted ? (
                          <Link href={`/learn/lessons/view/?id=${lesson.id}`} className="font-medium hover:text-teal transition-colors">
                            {lesson.title}
                          </Link>
                        ) : (
                          <span className={`font-medium ${isLocked ? "text-muted" : ""}`}>{lesson.title}</span>
                        )}
                        <div className="flex gap-2 mt-0.5">
                          <Badge color={lesson.type === "concept" ? "#167D8D" : lesson.type === "application" ? "#B28B4B" : "#8e44ad"}>
                            {lesson.type}
                          </Badge>
                          <span className="text-xs text-muted">{lesson.estimatedMinutes} min</span>
                          {lesson.riskCategory === "safety-critical" && <Badge color="#c0392b">Safety-critical</Badge>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {modules.length === 1 && (
          <Card padding="md" className="text-center text-muted border-dashed">
            <p>Remaining weeks (2{program.durationWeeks}) are planned content. Lesson titles and outlines will appear as you progress.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
