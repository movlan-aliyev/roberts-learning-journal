"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db, type Program, type Module, type LessonOutline } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillPoster } from "@/components/visuals/CategoryVisual";
import { ArrowLeft, PlayCircle } from "lucide-react";

export default function PublicSkillDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<LessonOutline[]>([]);

  useEffect(() => {
    if (!slug) return;
    db.programs.where("slug").equals(slug).first().then(async (p) => {
      if (!p) return;
      setProgram(p);
      setModules(await db.modules.where("programId").equals(p.id).sortBy("order"));
      setLessons(await db.lessonOutlines.where("programId").equals(p.id).sortBy("order"));
    });
  }, [slug]);

  if (!program) {
    return (
      <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-16 text-center">
        <p>Skill not found.</p>
        <Link href="/skills" className="text-teal hover:underline">All skills</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href="/skills" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> All skills
      </Link>

      <SkillPoster slug={program.slug} className="mb-6" />

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">{program.name}</h1>
        <p className="text-muted dark:text-muted-dark mb-3">{program.description}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge color={program.color}>{program.durationWeeks} weeks</Badge>
          <Badge color="#6b6560">{program.totalUnits} units</Badge>
          <Badge color="#167D8D">{program.weeklyPattern}</Badge>
        </div>
        <Link href={`/learn/programs/${program.slug}`} className="inline-block mt-4">
          <Button size="sm"><PlayCircle size={14} /> Start studying</Button>
        </Link>
      </header>

      <div className="space-y-6">
        {modules.map((mod) => {
          const modLessons = lessons.filter((l) => l.moduleId === mod.id);
          return (
            <Card key={mod.id} padding="md">
              <h2 className="font-serif text-lg font-semibold mb-3">{mod.title}</h2>
              <div className="space-y-2">
                {modLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg bg-ink/[0.02] dark:bg-white/[0.03]">
                    <Link href={`/learn/lessons/view/?id=${lesson.id}`} className="flex-1 font-medium hover:text-teal">
                      {lesson.title}
                    </Link>
                    <Badge color={lesson.type === "concept" ? "#167D8D" : lesson.type === "application" ? "#B28B4B" : "#8e44ad"}>
                      {lesson.type}
                    </Badge>
                    <span className="text-xs text-muted">{lesson.estimatedMinutes} min</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {modules.length <= 1 && (
          <Card padding="md" className="text-center text-muted border-dashed">
            Remaining weeks (2-{program.durationWeeks}) are planned content. Titles appear as the curriculum expands.
          </Card>
        )}
      </div>
    </div>
  );
}
