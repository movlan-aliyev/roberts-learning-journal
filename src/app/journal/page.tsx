"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, type Post, type Category } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Clock, Search } from "lucide-react";

export default function JournalPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string | null>(null);

  useEffect(() => {
    db.posts.where("status").equals("published").reverse().sortBy("publishedAt").then(setPosts);
    db.categories.orderBy("order").toArray().then(setCategories);
  }, []);

  const filtered = posts.filter(p => {
    if (filterCat && !p.categoryIds.includes(filterCat)) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.whatILearned.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Journal</h1>
      <p className="text-muted dark:text-muted-dark mb-6">Everything I&#39;ve learned and published</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={filterCat || ""}
          onChange={e => setFilterCat(e.target.value || null)}
          className="rounded-lg border border-border dark:border-border-dark bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center text-muted">
          <p>No published posts yet{search ? " matching your search" : ""}.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <Link key={post.id} href={`/journal/${post.slug}`}>
              <Card hoverable padding="md" className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    {categories.filter(c => post.categoryIds.includes(c.id)).map(c => (
                      <Badge key={c.id} color={c.color}>{c.icon} {c.name}</Badge>
                    ))}
                  </div>
                  <h2 className="font-serif text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-muted dark:text-muted-dark line-clamp-2 mt-1">{post.whatILearned.slice(0, 160)}...</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted whitespace-nowrap">
                  <span className="flex items-center gap-1"><Clock size={12} />{post.readingTimeMinutes} min</span>
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
