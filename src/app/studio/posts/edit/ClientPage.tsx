"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import { db, type Post, type PostRevision, type Category, type Source } from "@/lib/db";
import { OwnerGuard } from "@/components/OwnerGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Dialog } from "@/components/ui/Dialog";
import { Save, Eye, EyeOff, ArrowLeft, Trash2, History, Plus, X, Image } from "lucide-react";
import { CategoryVisual } from "@/components/visuals/CategoryVisual";
import { defaultVisualFor, visualChecklist } from "@/lib/content-visuals";

export default function PostEditorPage() {
  return <OwnerGuard><PostEditor /></OwnerGuard>;
}

function PostEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("id") || "";

  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [revisions, setRevisions] = useState<PostRevision[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!postId) return;
    db.posts.get(postId).then(p => setPost(p || null));
    db.categories.orderBy("order").toArray().then(setCategories);
    db.postRevisions.where("postId").equals(postId).reverse().sortBy("createdAt").then(setRevisions);
  }, [postId]);

  const savePost = useCallback(async (updated: Post) => {
    setAutoSaveStatus("saving");
    const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
    await db.posts.put(withTimestamp);

    // Save revision
    const revision: PostRevision = {
      id: uuid(), postId: updated.id,
      content: JSON.stringify(withTimestamp),
      createdAt: new Date().toISOString(),
    };
    await db.postRevisions.add(revision);

    setAutoSaveStatus("saved");
    setPost(withTimestamp);
  }, []);

  function updateField(field: keyof Post, value: unknown) {
    if (!post) return;
    const updated = { ...post, [field]: value };
    setPost(updated);
    setAutoSaveStatus("unsaved");

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => savePost(updated), 2000);
  }

  async function handlePublish() {
    if (!post) return;
    const updated = {
      ...post,
      status: "published" as const,
      publishedAt: post.publishedAt || new Date().toISOString(),
      ownerApproved: true,
    };
    await savePost(updated);
  }

  async function handleUnpublish() {
    if (!post) return;
    await savePost({ ...post, status: "draft" as const });
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post?")) return;
    await db.posts.delete(post.id);
    await db.postRevisions.where("postId").equals(post.id).delete();
    router.push("/studio/posts");
  }

  async function restoreRevision(rev: PostRevision) {
    const restored = JSON.parse(rev.content) as Post;
    await savePost(restored);
    setShowRevisions(false);
  }

  function addSource() {
    if (!post) return;
    const src: Source = { id: uuid(), type: "website", title: "", author: "", url: "", checkedDate: new Date().toISOString().split("T")[0], license: "", note: "" };
    updateField("sources", [...post.sources, src]);
  }

  function updateSource(idx: number, field: keyof Source, value: string) {
    if (!post) return;
    const sources = [...post.sources];
    sources[idx] = { ...sources[idx], [field]: value };
    updateField("sources", sources);
  }

  function removeSource(idx: number) {
    if (!post) return;
    updateField("sources", post.sources.filter((_, i) => i !== idx));
  }

  if (!post) return <div className="max-w-3xl mx-auto p-8 text-center text-muted">Loading...</div>;

  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "") || "untitled";

  return (
    <div className="max-w-4xl mx-auto px-[var(--spacing-page)] py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/studio/posts" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-ink-light">
          <ArrowLeft size={14} /> All posts
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted flex items-center gap-1">
            {autoSaveStatus === "saved" && "? Saved"}
            {autoSaveStatus === "saving" && "Saving..."}
            {autoSaveStatus === "unsaved" && "? Unsaved"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => savePost(post)}><Save size={14} /></Button>
          <Button variant="ghost" size="sm" onClick={() => setShowRevisions(true)}><History size={14} /></Button>
          {post.status === "published" ? (
            <Button variant="secondary" size="sm" onClick={handleUnpublish}><EyeOff size={14} /> Unpublish</Button>
          ) : (
            <Button size="sm" onClick={handlePublish}><Eye size={14} /> Publish</Button>
          )}
        </div>
      </div>

      <Tabs tabs={[
        { id: "content", label: "Content", content: (
          <div className="space-y-5">
            <FormField label="Title">
              <Input value={post.title} onChange={e => updateField("title", e.target.value)} className="font-serif text-xl" />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Slug">
                <Input value={post.slug} onChange={e => updateField("slug", e.target.value)} placeholder={slug} />
              </FormField>
              <FormField label="Language">
                <select value={post.language} onChange={e => updateField("language", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-white dark:bg-[#1a1a1a]">
                  <option value="en">English</option>
                  <option value="tr">Turkçe</option>
                  <option value="az">Az?rbaycanca</option>
                </select>
              </FormField>
            </div>

            <FormField label="Categories">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <label key={cat.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors border ${post.categoryIds.includes(cat.id) ? "border-teal bg-teal/10 text-teal" : "border-border hover:border-teal/50"}`}>
                    <input type="checkbox" className="sr-only"
                      checked={post.categoryIds.includes(cat.id)}
                      onChange={e => {
                        const ids = e.target.checked
                          ? [...post.categoryIds, cat.id]
                          : post.categoryIds.filter(id => id !== cat.id);
                        updateField("categoryIds", ids);
                      }}
                    />
                    {cat.icon} {cat.name}
                  </label>
                ))}
              </div>
            </FormField>

            {/* Visual is required for every post */}
            <Card padding="md" className="bg-teal/5 border-teal/20">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Image size={14} className="text-teal" /> Visual (required)
              </h3>
              <p className="text-xs text-muted mb-3">
                Content generation always attaches a visual: flags, maps, diagrams, covers, or skill posters.
              </p>
              {(() => {
                const catSlugs = categories.filter(c => post.categoryIds.includes(c.id)).map(c => c.slug);
                const spec = defaultVisualFor({ categorySlugs: catSlugs, title: post.title });
                return (
                  <>
                    <ul className="text-xs text-muted mb-3 space-y-0.5">
                      {visualChecklist(spec).map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                    {catSlugs[0] ? (
                      <CategoryVisual categorySlug={catSlugs[0]} variant="card" />
                    ) : (
                      <p className="text-sm text-warning">Select a category to preview its visual.</p>
                    )}
                  </>
                );
              })()}
            </Card>

            <FormField label="What I Learned" hint="Clear, verified explanation in your own words">
              <Textarea value={post.whatILearned} onChange={e => updateField("whatILearned", e.target.value)} className="min-h-[200px]" />
            </FormField>

            <FormField label="My Perspective" hint="Your personal notes, interpretation, reactions -- only you can write this">
              <Textarea value={post.myPerspective} onChange={e => updateField("myPerspective", e.target.value)} className="border-gold/30 bg-gold/5" />
            </FormField>

            <FormField label="An Example That Made It Click">
              <Textarea value={post.exampleThatClicked} onChange={e => updateField("exampleThatClicked", e.target.value)} className="min-h-[80px]" />
            </FormField>

            <FormField label="What I Still Want to Understand">
              <Textarea value={post.stillWantToUnderstand} onChange={e => updateField("stillWantToUnderstand", e.target.value)} className="min-h-[80px]" />
            </FormField>
          </div>
        )},
        { id: "sources", label: `Sources (${post.sources.length})`, content: (
          <div className="space-y-4">
            {post.sources.map((src, i) => (
              <Card key={src.id} padding="sm">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Source {i + 1}</span>
                  <button onClick={() => removeSource(i)} className="text-muted hover:text-danger"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={src.title} onChange={e => updateSource(i, "title", e.target.value)} placeholder="Title" />
                  <Input value={src.author} onChange={e => updateSource(i, "author", e.target.value)} placeholder="Author" />
                  <Input value={src.url} onChange={e => updateSource(i, "url", e.target.value)} placeholder="URL" className="col-span-2" />
                  <Input value={src.checkedDate} onChange={e => updateSource(i, "checkedDate", e.target.value)} type="date" />
                  <select value={src.type} onChange={e => updateSource(i, "type", e.target.value)}
                    className="rounded-lg border border-border px-3 py-2 text-sm">
                    <option value="website">Website</option><option value="book">Book</option>
                    <option value="video">Video</option><option value="paper">Paper</option>
                    <option value="official">Official</option><option value="other">Other</option>
                  </select>
                </div>
              </Card>
            ))}
            <Button variant="secondary" size="sm" onClick={addSource}><Plus size={14} /> Add source</Button>
          </div>
        )},
        { id: "preview", label: "Preview", content: (
          <article className="prose max-w-none">
            <div className="flex gap-2 mb-3">{categories.filter(c => post.categoryIds.includes(c.id)).map(c => <Badge key={c.id} color={c.color}>{c.icon} {c.name}</Badge>)}</div>
            <h1 className="font-serif text-3xl font-bold">{post.title}</h1>
            <div className="whitespace-pre-wrap mt-4">{post.whatILearned}</div>
            {post.exampleThatClicked && <blockquote className="border-l-4 border-l-gold pl-4 italic mt-4">{post.exampleThatClicked}</blockquote>}
            {post.myPerspective && <><h2>My Perspective</h2><div className="whitespace-pre-wrap italic">{post.myPerspective}</div></>}
            {post.stillWantToUnderstand && <><h2>What I Still Want to Understand</h2><p>{post.stillWantToUnderstand}</p></>}
          </article>
        )},
      ]} />

      <div className="flex justify-between pt-6 mt-6 border-t border-border dark:border-border-dark">
        <Button variant="danger" size="sm" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
        {post.status === "published" && (
          <Link href={`/journal/${post.slug}`} className="text-sm text-teal hover:underline">View published post ?</Link>
        )}
      </div>

      {/* Revisions dialog */}
      <Dialog open={showRevisions} onClose={() => setShowRevisions(false)} title="Revision History">
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {revisions.length === 0 ? (
            <p className="text-sm text-muted">No revisions yet.</p>
          ) : revisions.map(rev => (
            <div key={rev.id} className="flex items-center justify-between p-2 rounded hover:bg-ink/5">
              <span className="text-sm">{new Date(rev.createdAt).toLocaleString()}</span>
              <Button variant="ghost" size="sm" onClick={() => restoreRevision(rev)}>Restore</Button>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
