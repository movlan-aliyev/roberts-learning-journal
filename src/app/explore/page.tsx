"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, type Category, type Post } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkillPoster } from "@/components/visuals/CategoryVisual";
import { FlagSvg, SEA_FLAGS } from "@/components/visuals/Flag";

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    db.categories.orderBy("order").toArray().then((rows) => {
      const seen = new Set<string>();
      setCategories(rows.filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true))));
    });
    db.posts.where("status").equals("published").toArray().then((rows) => {
      const seen = new Set<string>();
      setPosts(rows.filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true))));
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-[var(--spacing-page)] py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Explore Topics</h1>
      <p className="text-muted dark:text-muted-dark mb-8">
        Every topic includes visuals — flags, maps, diagrams, or illustrated posters.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const count = posts.filter(p => p.categoryIds.includes(cat.id)).length;
          return (
            <Link key={cat.id} href={`/topics/${cat.slug}`}>
              <Card hoverable padding="none" className="h-full overflow-hidden">
                {cat.slug === "flags" ? (
                  <div className="p-3 grid grid-cols-5 gap-1 bg-ink/5">
                    {SEA_FLAGS.map(id => <FlagSvg key={id} id={id} className="w-full rounded-sm" />)}
                  </div>
                ) : (
                  <SkillPoster slug={cat.slug} className="!my-0 rounded-none" />
                )}
                <div className="p-4">
                  <h2 className="font-serif text-lg font-semibold mb-1">{cat.name}</h2>
                  <p className="text-sm text-muted dark:text-muted-dark mb-3">{cat.description}</p>
                  <Badge color={cat.color}>{count} {count === 1 ? "post" : "posts"}</Badge>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
