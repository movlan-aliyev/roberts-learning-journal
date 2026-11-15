"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db, type BookFilm } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea, Input, FormField } from "@/components/ui/Input";
import { ArrowLeft, Star, Eye, EyeOff, Save } from "lucide-react";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isOwner } = useAuth();
  const [item, setItem] = useState<BookFilm | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<BookFilm>>({});

  useEffect(() => {
    if (!slug) return;
    db.bookFilms.where("slug").equals(slug).first().then(i => {
      if (i && (i.isPublished || isOwner)) { setItem(i); setForm(i); }
    });
  }, [slug, isOwner]);

  if (!item) return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-16 text-center">
      <p>Not found.</p><Link href="/books" className="text-teal hover:underline">Back to shelf</Link>
    </div>
  );

  async function handleSave() {
    if (!item) return;
    const updated = { ...item, ...form, updatedAt: new Date().toISOString() };
    await db.bookFilms.put(updated);
    setItem(updated);
    setEditing(false);
  }

  async function togglePublish() {
    if (!item) return;
    const updated = { ...item, isPublished: !item.isPublished, updatedAt: new Date().toISOString() };
    await db.bookFilms.put(updated);
    setItem(updated);
  }

  const sections = [
    { key: "premise", label: "Premise" },
    { key: "themes", label: "Themes" },
    { key: "strongestIdea", label: "Strongest Idea / Scene" },
    { key: "whatWorked", label: "What Worked" },
    { key: "whatIQuestion", label: "What I Question" },
    { key: "connections", label: "Connections" },
    { key: "whoMightAppreciate", label: "Who Might Appreciate It" },
    { key: "takeaway", label: "My Takeaway" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href="/books" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> Back to shelf
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge color={item.isPublished ? "#2d8a4e" : "#c27c0e"}>{item.isPublished ? "Published" : item.status}</Badge>
          {item.hasSpoilers && <Badge color="#c0392b">Contains spoilers</Badge>}
        </div>
        <h1 className="font-serif text-3xl font-bold">{item.title}</h1>
        <p className="text-muted dark:text-muted-dark">{item.creator} {item.year && `(${item.year})`}</p>
        {item.rating && (
          <div className="flex items-center gap-1 mt-2 text-gold"><Star size={16} fill="currentColor" /> {item.rating}/10</div>
        )}
      </header>

      {isOwner && !editing && (
        <div className="flex gap-2 mb-6">
          <Button size="sm" onClick={() => setEditing(true)}>Edit review</Button>
          <Button size="sm" variant="secondary" onClick={togglePublish}>
            {item.isPublished ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
          </Button>
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Status">
              <select value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value as BookFilm["status"] })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                <option value="want">Want to {item.type === "book" ? "read" : "watch"}</option>
                <option value={item.type === "book" ? "reading" : "watching"}>{item.type === "book" ? "Reading" : "Watching"}</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </FormField>
            <FormField label="Rating (1-10)">
              <Input type="number" min={1} max={10} value={form.rating || ""} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || null })} />
            </FormField>
          </div>
          <FormField label="Contains spoilers?">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.hasSpoilers || false} onChange={e => setForm({ ...form, hasSpoilers: e.target.checked })} />
              Yes, this review contains spoilers
            </label>
          </FormField>
          {sections.map(s => (
            <FormField key={s.key} label={s.label}>
              <Textarea value={String((form as Partial<BookFilm>)[s.key] ?? "")} onChange={e => setForm({ ...form, [s.key]: e.target.value })} />
            </FormField>
          ))}
          <FormField label="Private notes (never published)">
            <Textarea value={form.privateNotes || ""} onChange={e => setForm({ ...form, privateNotes: e.target.value })} className="border-gold/30 bg-gold/5" />
          </FormField>
          <div className="flex gap-2">
            <Button onClick={handleSave}><Save size={14} /> Save</Button>
            <Button variant="ghost" onClick={() => { setForm(item); setEditing(false); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(s => {
            const val = item[s.key];
            if (!val) return null;
            const isSpoiler = item.hasSpoilers && ["strongestIdea", "whatWorked", "whatIQuestion"].includes(s.key);
            return (
              <section key={s.key}>
                <h2 className="font-serif text-lg font-semibold mb-2">{s.label}</h2>
                {isSpoiler ? (
                  <details><summary className="text-sm text-warning cursor-pointer">Reveal spoiler</summary><p className="mt-2 whitespace-pre-wrap">{val}</p></details>
                ) : (
                  <p className="whitespace-pre-wrap">{val}</p>
                )}
              </section>
            );
          })}
          {isOwner && item.privateNotes && (
            <Card padding="md" className="border-l-4 border-l-gold bg-gold/5">
              <h3 className="text-sm font-semibold text-gold mb-1">Private Notes</h3>
              <p className="whitespace-pre-wrap text-sm">{item.privateNotes}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
