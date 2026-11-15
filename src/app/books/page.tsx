"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type BookFilm } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Plus, Star } from "lucide-react";
import { v4 as uuid } from "uuid";
import { BookCover } from "@/components/visuals/BookCover";

export default function BooksFilmsPage() {
  const { isOwner } = useAuth();
  const [items, setItems] = useState<BookFilm[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"book" | "film">("book");

  useEffect(() => { loadItems(); }, [isOwner]);

  async function loadItems() {
    const all = await db.bookFilms.toArray();
    setItems(isOwner ? all : all.filter(i => i.isPublished));
  }

  const books = items.filter(i => i.type === "book");
  const films = items.filter(i => i.type === "film");

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const now = new Date().toISOString();
    const title = fd.get("title") as string;
    const item: BookFilm = {
      id: uuid(), type: addType, title, creator: fd.get("creator") as string,
      year: fd.get("year") as string, language: "en",
      status: "want", completedDate: null, rating: null, hasSpoilers: false,
      premise: "", themes: "", strongestIdea: "", whatWorked: "", whatIQuestion: "",
      connections: "", whoMightAppreciate: "", takeaway: "", privateNotes: "",
      isPublished: false, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
      coverUrl: null, createdAt: now, updatedAt: now,
    };
    await db.bookFilms.add(item);
    setShowAdd(false);
    loadItems();
  }

  function renderList(list: BookFilm[]) {
    if (list.length === 0) return (
      <Card padding="lg" className="text-center text-muted">
        {isOwner ? "Nothing here yet. Add your first entry!" : "No published entries yet."}
      </Card>
    );
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(item => (
          <Link key={item.id} href={`/books/view/?slug=${encodeURIComponent(item.slug)}`}>
            <Card hoverable padding="none" className="h-full overflow-hidden flex flex-col">
              <div className="p-3 pb-0">
                <BookCover
                  title={item.title || "Untitled"}
                  creator={item.creator}
                  year={item.year}
                  type={item.type}
                  className="w-full"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <Badge color={item.isPublished ? "#2d8a4e" : "#c27c0e"}>{item.isPublished ? "Published" : item.status}</Badge>
                  {item.rating && (
                    <span className="flex items-center gap-0.5 text-sm text-gold"><Star size={12} fill="currentColor" /> {item.rating}/10</span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark">{item.creator} {item.year && `(${item.year})`}</p>
                {item.takeaway && <p className="text-sm text-muted mt-2 line-clamp-2">{item.takeaway}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Books & Films</h1>
          <p className="text-muted dark:text-muted-dark">What I&#39;m reading, watching, and thinking about</p>
        </div>
        {isOwner && (
          <Button onClick={() => setShowAdd(true)} size="sm"><Plus size={16} /> Add</Button>
        )}
      </div>

      <Tabs tabs={[
        { id: "books", label: `?? Books (${books.length})`, content: renderList(books) },
        { id: "films", label: `?? Films (${films.length})`, content: renderList(films) },
      ]} />

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="Add to shelf">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex gap-2 mb-2">
            <Button type="button" variant={addType === "book" ? "primary" : "secondary"} size="sm" onClick={() => setAddType("book")}>Book</Button>
            <Button type="button" variant={addType === "film" ? "primary" : "secondary"} size="sm" onClick={() => setAddType("film")}>Film</Button>
          </div>
          <FormField label="Title"><Input name="title" required /></FormField>
          <FormField label="Creator"><Input name="creator" placeholder="Author or director" /></FormField>
          <FormField label="Year"><Input name="year" placeholder="2024" /></FormField>
          <Button type="submit">Add to shelf</Button>
        </form>
      </Dialog>
    </div>
  );
}
