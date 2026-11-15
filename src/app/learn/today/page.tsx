"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { db, type Program, type Enrollment, type DailyAssignment, type LessonOutline } from "@/lib/db";
import { getDueCount } from "@/lib/spaced-repetition";
import { prepareDailyLessons } from "@/lib/prepare-daily";
import { useAuth } from "@/lib/auth";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlayCircle, RotateCcw, BookOpen, Clock, ChevronRight } from "lucide-react";

export default function TodayPage() {
  return <OwnerGuard><TodayContent /></OwnerGuard>;
}

function TodayContent() {
  const { profile } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);
  const [lessons, setLessons] = useState<LessonOutline[]>([]);
  const [dueReviews, setDueReviews] = useState(0);

  const today = format(new Date(), "yyyy-MM-dd");
  const dayName = format(new Date(), "EEEE");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    async function load() {
      // Recover missed schedules on open (idempotent)
      await prepareDailyLessons();
      setPrograms(await db.programs.orderBy("order").toArray());
      setEnrollments(await db.enrollments.toArray());
      setAssignments(await db.dailyAssignments.where("date").equals(today).toArray());
      setLessons(await db.lessonOutlines.toArray());
      setDueReviews(await getDueCount(today));
    }
    load();
  }, [today]);

  const activeEnrollments = enrollments.filter(e => e.status === "active");
  const completedToday = assignments.filter(a => a.status === "completed").length;
  const totalToday = assignments.length || activeEnrollments.length;

  function getProgram(programId: string) { return programs.find(p => p.id === programId); }
  function getLesson(lessonId: string) { return lessons.find(l => l.id === lessonId); }
  function getProgress(enrollment: Enrollment) {
    const prog = getProgram(enrollment.programId);
    if (!prog) return 0;
    return Math.round((enrollment.completedLessonIds.length / prog.totalUnits) * 100);
  }

  return (
    <div className="max-w-4xl mx-auto px-[var(--spacing-page)] py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-muted dark:text-muted-dark">{dayName}, {format(new Date(), "MMMM d, yyyy")}</p>
        <h1 className="font-serif text-2xl font-bold">{greeting}, {profile?.name?.split(" ")[0] || "Robert"}</h1>
      </div>

      {/* Continue learning CTA */}
      {activeEnrollments.length > 0 && (
        <Card padding="lg" className="mb-6 bg-teal/5 border-teal/20">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-serif text-lg font-semibold">Continue Learning</h2>
              <p className="text-sm text-muted dark:text-muted-dark">{completedToday}/{totalToday} sessions completed today - ~{profile?.dailyBudgetMinutes || 91} min budget</p>
            </div>
            {activeEnrollments[0]?.currentLessonId && (
              <Link href={`/learn/lessons/view/?id=${activeEnrollments[0].currentLessonId}`}>
                <Button><PlayCircle size={18} /> Start next lesson</Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Due reviews */}
      {dueReviews > 0 && (
        <Link href="/learn/review">
          <Card hoverable padding="md" className="mb-6 flex items-center justify-between bg-gold/5 border-gold/20">
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-gold" />
              <div>
                <h3 className="font-semibold">Spaced Review</h3>
                <p className="text-sm text-muted">{dueReviews} cards due today</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </Card>
        </Link>
      )}

      {/* Program cards */}
      <h2 className="font-serif text-lg font-semibold mb-3">Your Programs</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {activeEnrollments.map(enrollment => {
          const prog = getProgram(enrollment.programId);
          if (!prog) return null;
          const progress = getProgress(enrollment);
          const currentLesson = enrollment.currentLessonId ? getLesson(enrollment.currentLessonId) : null;

          return (
            <Link key={enrollment.id} href={`/learn/programs/${prog.slug}`}>
              <Card hoverable padding="md" className="h-full">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{prog.icon}</span>
                  {enrollment.status === "paused" && <Badge color="#c27c0e">Paused</Badge>}
                </div>
                <h3 className="font-semibold mb-1">{prog.name}</h3>
                {currentLesson && (
                  <p className="text-sm text-muted dark:text-muted-dark mb-2 line-clamp-1">
                    Next: {currentLesson.title}
                  </p>
                )}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>{enrollment.completedLessonIds.length}/{prog.totalUnits} units</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border dark:bg-border-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: prog.color }} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick note */}
      <Card padding="md" className="mb-6">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><BookOpen size={16} className="text-teal" /> Quick Note</h3>
        <textarea
          placeholder="Jot something down..."
          className="w-full rounded-lg border border-border dark:border-border-dark bg-transparent px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </Card>

      {/* Weekly overview */}
      <Card padding="md">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Clock size={16} className="text-teal" /> This Week</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => {
            const isStudyDay = profile?.studyDays.includes(i);
            const isToday = new Date().getDay() === i;
            return (
              <div key={d} className={`py-2 rounded ${isToday ? "bg-teal text-white font-bold" : isStudyDay ? "bg-teal/10 text-teal" : "text-muted"}`}>
                {d}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
