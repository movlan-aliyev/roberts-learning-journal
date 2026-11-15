"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, type Category, type Post } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Clock } from "lucide-react";
import { CategoryVisual } from "@/components/visuals/CategoryVisual";

export default function TopicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!slug) return;
    db.categories.where("slug").equals(slug).first().then(c => {
      if (c) {
        setCategory(c);
        db.posts.where("status").equals("published").toArray().then(all => {
          setPosts(all.filter(p => p.categoryIds.includes(c.id)));
        });
      }
    });
  }, [slug]);

  if (!category) return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-16 text-center">
      <p>Topic not found.</p>
      <Link href="/explore" className="text-teal hover:underline">Explore topics</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> All topics
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="font-serif text-3xl font-bold">{category.name}</h1>
          <p className="text-muted dark:text-muted-dark">{category.description}</p>
        </div>
      </div>

      <CategoryVisual categorySlug={category.slug} />

      {posts.length === 0 ? (
        <Card padding="lg" className="text-center text-muted">No published posts in this topic yet.</Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link key={post.id} href={`/journal/${post.slug}`}>
              <Card hoverable padding="md" className="mb-4">
                <h2 className="font-serif text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-muted dark:text-muted-dark line-clamp-2 mt-1">{post.whatILearned.slice(0, 160)}...</p>
                <div className="flex items-center gap-2 text-xs text-muted mt-2">
                  <Clock size={12} /> {post.readingTimeMinutes} min
                  {post.publishedAt && <span>- {new Date(post.publishedAt).toLocaleDateString()}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
