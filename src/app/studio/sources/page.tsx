"use client";
import { useEffect, useState } from "react";
import { db, type Post, type Source } from "@/lib/db";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Search, ExternalLink } from "lucide-react";

export default function SourcesPage() {
  return <OwnerGuard><SourcesContent /></OwnerGuard>;
}

function SourcesContent() {
  const [allSources, setAllSources] = useState<(Source & { postTitle: string })[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    db.posts.toArray().then(posts => {
      const sources: (Source & { postTitle: string })[] = [];
      posts.forEach(p => {
        p.sources.forEach(s => sources.push({ ...s, postTitle: p.title }));
      });
      setAllSources(sources);
    });
  }, []);

  const filtered = allSources.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q) || s.postTitle.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Source Library</h1>
      <p className="text-muted dark:text-muted-dark mb-6">All sources referenced across your posts</p>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sources..." className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center text-muted">No sources found.</Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <Card key={`${s.id}-${i}`} padding="sm" className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{s.title || "Untitled"}</span>
                  <Badge color="#6b6560">{s.type}</Badge>
                </div>
                {s.author && <p className="text-xs text-muted">{s.author}</p>}
                <p className="text-xs text-muted">Used in: {s.postTitle}</p>
                {s.checkedDate && <p className="text-xs text-muted">Checked: {s.checkedDate}</p>}
              </div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal-light flex-shrink-0">
                  <ExternalLink size={14} />
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
