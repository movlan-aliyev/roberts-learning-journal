"use client";
import { useEffect, useState } from "react";
import { db, type OwnerProfile } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Save, Download, Upload, Database, Clock } from "lucide-react";

export default function SettingsPage() {
  return <OwnerGuard><SettingsContent /></OwnerGuard>;
}

function SettingsContent() {
  const { profile, updateProfile } = useAuth();
  const [overrides, setOverrides] = useState<Partial<OwnerProfile>>({});
  const form = { ...(profile || {}), ...overrides } as Partial<OwnerProfile>;
  const setForm = (next: Partial<OwnerProfile> | ((prev: Partial<OwnerProfile>) => Partial<OwnerProfile>)) => {
    const value = typeof next === "function" ? next(form) : next;
    setOverrides(value);
  };
  const [saved, setSaved] = useState(false);
  const [dbStats, setDbStats] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stats = {
        posts: await db.posts.count(),
        bookFilms: await db.bookFilms.count(),
        programs: await db.programs.count(),
        lessons: await db.lessonOutlines.count(),
        flashcards: await db.flashcards.count(),
        reviewEvents: await db.reviewEvents.count(),
        learningEvents: await db.learningEvents.count(),
      };
      if (!cancelled) setDbStats(stats);
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSave() {
    await updateProfile(form);
    setOverrides({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    const data: Record<string, unknown[]> = {};
    const tables = ["ownerProfile","categories","posts","postRevisions","bookFilms","programs","modules","lessonOutlines","lessonContents","enrollments","dailyAssignments","learningEvents","flashcards","reviewStates","reviewEvents","automationRuns"];
    for (const t of tables) {
      data[t] = await (db as unknown as Record<string, {toArray:()=>Promise<unknown[]>}>)[t].toArray();
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learning-journal-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown[]>;
      for (const [table, rows] of Object.entries(data)) {
        if (table in db && Array.isArray(rows)) {
          const t = (db as unknown as Record<string, {bulkPut:(i:unknown[])=>Promise<void>}>)[table];
          if (t?.bulkPut) await t.bulkPut(rows);
        }
      }
      alert("Import successful. Refresh the page to see changes.");
    } catch { alert("Invalid import file."); }
  }

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Settings</h1>

      <Card padding="lg" className="mb-6">
        <h2 className="font-serif text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <FormField label="Display Name">
            <Input value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} />
          </FormField>
          <FormField label="Tagline">
            <Input value={form.tagline || ""} onChange={e => setForm({...form, tagline: e.target.value})} />
          </FormField>
        </div>
      </Card>

      <Card padding="lg" className="mb-6">
        <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-teal" /> Study Preferences
        </h2>
        <div className="space-y-4">
          <FormField label="Timezone">
            <Input value={form.timezone || ""} onChange={e => setForm({...form, timezone: e.target.value})} placeholder="America/New_York" />
          </FormField>
          <FormField label="Daily study budget (minutes)">
            <Input type="number" value={form.dailyBudgetMinutes || 91}
              onChange={e => setForm({...form, dailyBudgetMinutes: parseInt(e.target.value)})} />
          </FormField>
          <FormField label="Study days">
            <div className="flex gap-2">
              {days.map((d, i) => (
                <label key={d} className={`flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer text-sm font-medium border transition-colors ${
                  form.studyDays?.includes(i) ? "bg-teal text-white border-teal" : "border-border hover:border-teal/50"
                }`}>
                  <input type="checkbox" className="sr-only" checked={form.studyDays?.includes(i) || false}
                    onChange={e => {
                      const sd = form.studyDays || [];
                      setForm({...form, studyDays: e.target.checked ? [...sd, i].sort() : sd.filter(x => x !== i)});
                    }} />
                  {d}
                </label>
              ))}
            </div>
          </FormField>
          <FormField label="Focus mode">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.focusMode || false}
                onChange={e => setForm({...form, focusMode: e.target.checked})} className="accent-teal" />
              Reduce active programs and lower daily budget
            </label>
          </FormField>
        </div>
      </Card>

      <div className="flex gap-3 mb-8">
        <Button onClick={handleSave}><Save size={14} /> {saved ? "Saved" : "Save Settings"}</Button>
      </div>

      <Card padding="lg" className="mb-6">
        <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Database size={18} className="text-teal" /> Data
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {Object.entries(dbStats).map(([k, v]) => (
            <div key={k} className="text-center p-2 rounded-lg bg-ink/3 dark:bg-white/5">
              <div className="text-lg font-bold">{v}</div>
              <div className="text-xs text-muted">{k}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={14} /> Export JSON
          </Button>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-teal text-teal hover:bg-teal/10 transition-colors">
              <Upload size={14} /> Import JSON
            </span>
            <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
          </label>
        </div>
      </Card>

      <Card padding="md" className="bg-teal/5 border-teal/20">
        <h3 className="font-semibold text-sm mb-1">Free and open</h3>
        <p className="text-sm text-muted">
          No login or paywall. Progress is stored in this browser&#39;s IndexedDB and persists across reloads.
          Optional cloud sync can be added later via <code className="bg-ink/5 px-1 rounded">.env</code>.
        </p>
      </Card>
    </div>
  );
}
