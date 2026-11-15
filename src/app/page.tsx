"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, type Post, type Category } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { FlagSvg, SEA_FLAGS } from "@/components/visuals/Flag";
import { SkillPoster } from "@/components/visuals/CategoryVisual";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    db.posts.where("status").equals("published").reverse().sortBy("publishedAt").then(p => setPosts(p.slice(0, 6)));
    db.categories.orderBy("order").toArray().then((rows) => {
      const seen = new Set<string>();
      setCategories(rows.filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true))));
    });
  }, []);

  const featured = posts[0];
  const recent = posts.slice(1, 4);
  const featuredIsFlags = featured?.slug?.includes("flags");

  return (
    <div className="max-w-7xl mx-auto px-[var(--spacing-page)] py-8">
      <section className="text-center py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink dark:text-ink-light mb-3">
          Robert&#39;s Learning Journal
        </h1>
        <p className="text-lg text-muted dark:text-muted-dark max-w-xl mx-auto mb-6">
          Learn something. Understand it. Make it your own.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/journal">
            <Button size="lg">Journal <ArrowRight size={18} /></Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="secondary">
              Explore <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/learn/review">
            <Button size="lg" variant="ghost">
              Review
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted mt-4 max-w-md mx-auto">
          Public can read and review. Write stays locked to the owner.
        </p>
      </section>

      {/* Featured with visual */}
      {featured && (
        <section className="mb-12">
          <h2 className="font-serif text-sm uppercase tracking-wider text-muted dark:text-muted-dark mb-4">What I learned recently</h2>
          <Link href={`/journal/${featured.slug}`}>
            <Card hoverable padding="lg">
              {featuredIsFlags && (
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-5">
                  {SEA_FLAGS.map(id => (
                    <FlagSvg key={id} id={id} className="w-full rounded-sm" />
                  ))}
                </div>
              )}
              <div className="flex gap-2 mb-3 flex-wrap">
                {categories.filter(c => featured.categoryIds.includes(c.id)).map(c => (
                  <Badge key={c.id} color={c.color}>{c.icon} {c.name}</Badge>
                ))}
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">{featured.title}</h3>
              <p className="text-muted dark:text-muted-dark line-clamp-3 mb-4">
                {featured.whatILearned.slice(0, 200)}...
              </p>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="flex items-center gap-1"><Clock size={14} /> {featured.readingTimeMinutes} min read</span>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Latest Entries</h2>
            <Link href="/journal" className="text-sm text-teal hover:underline">View all &rarr;</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(post => (
              <Link key={post.id} href={`/journal/${post.slug}`}>
                <Card hoverable padding="md" className="h-full flex flex-col">
                  {post.slug.includes("sky") || post.slug.includes("rayleigh") ? (
                    <div className="h-24 rounded-lg mb-3 bg-[#0a1628] flex items-center justify-center text-xs text-[#4da6ff]">
                      Rayleigh diagram
                    </div>
                  ) : null}
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {categories.filter(c => post.categoryIds.includes(c.id)).map(c => (
                      <Badge key={c.id} color={c.color}>{c.icon} {c.name}</Badge>
                    ))}
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted dark:text-muted-dark line-clamp-2 flex-1">{post.whatILearned.slice(0, 120)}...</p>
                  <div className="flex items-center gap-2 text-xs text-muted mt-3">
                    <Clock size={12} /> {post.readingTimeMinutes} min
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="font-serif text-xl font-semibold mb-4">Explore Topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} href={`/topics/${cat.slug}`}>
              <Card hoverable padding="sm" className="text-center overflow-hidden">
                {cat.slug === "flags" ? (
                  <div className="grid grid-cols-3 gap-0.5 mb-2">
                    {SEA_FLAGS.slice(0, 3).map(id => <FlagSvg key={id} id={id} className="w-full rounded-sm" />)}
                  </div>
                ) : (
                  <div className="mb-2"><SkillPoster slug={cat.slug} className="!my-0 scale-100" /></div>
                )}
                <div className="font-medium text-sm">{cat.name}</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <Card padding="lg" className="text-center max-w-2xl mx-auto">
          <BookOpen size={32} className="text-teal mx-auto mb-3" />
          <h2 className="font-serif text-xl font-semibold mb-2">About This Journal</h2>
          <p className="text-muted dark:text-muted-dark mb-4">
            A personal learning journal with verified explanations and visuals for every topic.
          </p>
          <Link href="/about"><Button variant="secondary">Learn more about me</Button></Link>
        </Card>
      </section>
    </div>
  );
}
