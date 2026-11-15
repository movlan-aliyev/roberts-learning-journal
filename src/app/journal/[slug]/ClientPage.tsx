"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db, type Post, type Category } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Clock, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { CategoryVisual } from "@/components/visuals/CategoryVisual";
import { RayleighDiagram } from "@/components/visuals/ScienceDiagram";

export default function PostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { isOwner } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    db.posts.where("slug").equals(slug).first().then(p => {
      if (p && (p.status === "published" || isOwner)) setPost(p);
    });
    db.categories.toArray().then(setCats);
  }, [slug, isOwner]);

  if (!post) return (
    <div className="max-w-3xl mx-auto px-[var(--spacing-page)] py-16 text-center">
      <h1 className="font-serif text-2xl mb-2">Post not found</h1>
      <Link href="/journal" className="text-teal hover:underline">Back to journal</Link>
    </div>
  );

  const postCats = cats.filter(c => post.categoryIds.includes(c.id));

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <article className="max-w-3xl mx-auto px-[var(--spacing-page)] py-8">
      <Link href="/journal" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light mb-6">
        <ArrowLeft size={14} /> Back to journal
      </Link>

      <header className="mb-8">
        <div className="flex gap-2 mb-3 flex-wrap">
          {postCats.map(c => <Badge key={c.id} color={c.color}>{c.icon} {c.name}</Badge>)}
          {post.status === "draft" && <Badge color="#c27c0e">Draft</Badge>}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted dark:text-muted-dark">
          <span className="flex items-center gap-1"><Clock size={14} /> {post.readingTimeMinutes} min read</span>
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
          <span className="uppercase text-xs">{post.language}</span>
        </div>
      </header>

      {/* Required visual — flags, maps, diagrams, posters */}
      <section className="mb-8" aria-label="Lesson visual">
        {postCats.some(c => c.slug === "flags") && <CategoryVisual categorySlug="flags" />}
        {postCats.some(c => c.slug === "geography") && !postCats.some(c => c.slug === "flags") && (
          <CategoryVisual categorySlug="geography" />
        )}
        {(postCats.some(c => c.slug === "science") || post.slug.includes("rayleigh") || post.slug.includes("sky")) && (
          <RayleighDiagram />
        )}
        {postCats.some(c => c.slug === "books") && <CategoryVisual categorySlug="books" />}
        {postCats.some(c => c.slug === "movies") && <CategoryVisual categorySlug="movies" />}
        {postCats.length > 0 &&
          !postCats.some(c => ["flags", "geography", "science", "books", "movies"].includes(c.slug)) && (
          <CategoryVisual categorySlug={postCats[0].slug} />
        )}
      </section>

      {/* What I learned */}
      <section className="mb-8">
        <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-teal" /> What I Learned
        </h2>
        <div className="prose whitespace-pre-wrap">{post.whatILearned}</div>
      </section>

      {/* Example */}
      {post.exampleThatClicked && (
        <section className="mb-8">
          <Card padding="md" className="border-l-4 border-l-gold bg-gold/5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gold mb-2">An example that made it click</h3>
            <p>{post.exampleThatClicked}</p>
          </Card>
        </section>
      )}

      {/* My perspective */}
      {post.myPerspective && (
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold mb-3">My Perspective</h2>
          <div className="prose whitespace-pre-wrap italic">{post.myPerspective}</div>
        </section>
      )}

      {/* Still want to understand */}
      {post.stillWantToUnderstand && (
        <section className="mb-8">
          <Card padding="md" className="border-l-4 border-l-teal bg-teal/5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-teal mb-2">What I still want to understand</h3>
            <p>{post.stillWantToUnderstand}</p>
          </Card>
        </section>
      )}

      {/* Glossary */}
      {Object.keys(post.glossary).length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-lg font-semibold mb-3">Key Terms</h2>
          <div className="grid gap-2">
            {Object.entries(post.glossary).map(([term, defs]) => (
              <Card key={term} padding="sm" className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="font-semibold text-teal">{term}</span>
                <span className="text-sm text-muted">
                  {[defs.en, defs.tr, defs.az].filter(Boolean).join(" - ")}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {post.sources.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-lg font-semibold mb-3">Sources</h2>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            {post.sources.map((s, i) => (
              <li key={i} className="text-muted dark:text-muted-dark">
                <span className="font-medium text-ink dark:text-ink-light">{s.title}</span>
                {s.author && <span> -- {s.author}</span>}
                {s.url && <> - <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">Link</a></>}
                {s.checkedDate && <span className="text-xs"> (checked {s.checkedDate})</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Share / Edit */}
      <footer className="flex gap-3 pt-4 border-t border-border dark:border-border-dark">
        <Button variant="secondary" size="sm" onClick={handleShare}>
          <Share2 size={14} /> {copied ? "Copied!" : "Copy link"}
        </Button>
        {isOwner && (
          <Link href={`/studio/posts/edit/?id=${post.id}`}><Button variant="ghost" size="sm">Edit post</Button></Link>
        )}
      </footer>
    </article>
  );
}
