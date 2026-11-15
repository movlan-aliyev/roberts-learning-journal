"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { db, type Post, type Category } from "@/lib/db";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, FileText, Eye, Clock } from "lucide-react";

export default function StudioPostsPage() {
  return <OwnerGuard><PostsList /></OwnerGuard>;
}

function PostsList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

  useEffect(() => {
    db.posts.reverse().sortBy("updatedAt").then(setPosts);
    db.categories.toArray().then(setCategories);
  }, []);

  async function createPost() {
    const now = new Date().toISOString();
    const post: Post = {
      id: uuid(), title: "Untitled Post", slug: `untitled-${Date.now()}`,
      categoryIds: [], language: "en", status: "draft",
      whatILearned: "", myPerspective: "", exampleThatClicked: "",
      stillWantToUnderstand: "", glossary: {}, sources: [],
      readingTimeMinutes: 1, publishedAt: null,
      createdAt: now, updatedAt: now,
      featuredImage: null, featuredImageAlt: null,
      isAiGenerated: false, ownerApproved: true,
    };
    await db.posts.add(post);
    router.push(`/studio/posts/edit/?id=${post.id}`);
  }

  const filtered = posts.filter(p => filter === "all" || p.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Write</h1>
          <p className="text-muted dark:text-muted-dark">Your posts and drafts</p>
        </div>
        <Button onClick={createPost}><Plus size={16} /> New Post</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "draft", "published"] as const).map(f => (
          <Button key={f} variant={filter === f ? "primary" : "ghost"} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? posts.length : posts.filter(p => p.status === f).length})
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center text-muted">
          <FileText size={32} className="mx-auto mb-3" />
          <p>No posts yet. Create your first one!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <Link key={post.id} href={`/studio/posts/edit/?id=${post.id}`}>
              <Card hoverable padding="md" className="flex items-center gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold truncate">{post.title}</h2>
                    <Badge color={post.status === "published" ? "#2d8a4e" : "#c27c0e"}>{post.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readingTimeMinutes} min</span>
                    <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                    {categories.filter(c => post.categoryIds.includes(c.id)).map(c => (
                      <Badge key={c.id} color={c.color} className="text-[10px]">{c.icon} {c.name}</Badge>
                    ))}
                  </div>
                </div>
                {post.status === "published" && (
                  <Link href={`/journal/${post.slug}`} onClick={e => e.stopPropagation()} className="text-teal hover:text-teal-light">
                    <Eye size={16} />
                  </Link>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
