from pathlib import Path

p = Path("src/lib/seed.ts")
text = p.read_text(encoding="utf-8", errors="replace")
marker = "export async function seedDatabase()"
idx = text.find(marker)
start = text.rfind("/*", 0, idx)
if start < 0:
    start = idx
prefix = text[:start]

old = text[idx:]
now_idx = old.find("const now = new Date")
body = old[now_idx:].rstrip()
if body.endswith("}"):
    body = body[:-1].rstrip()

body = body.replace(
    "const categories: Category[] = CATEGORIES.map(c => ({ ...c, id: uuid() }));",
    "const categories: Category[] = CATEGORIES.map(c => ({ ...c, id: `cat-${c.slug}` }));",
)
body = body.replace(
    "const programs: Program[] = PROGRAMS.map(p => ({ ...p, id: uuid() }));",
    "const programs: Program[] = PROGRAMS.map(p => ({ ...p, id: `prog-${p.slug}` }));",
)

new_tail = '''let seedPromise: Promise<void> | null = null;

async function dedupeDatabase() {
  const cats = await db.categories.toArray();
  const seenCat = new Set<string>();
  for (const c of cats) {
    if (seenCat.has(c.slug)) await db.categories.delete(c.id);
    else seenCat.add(c.slug);
  }

  const progs = await db.programs.toArray();
  const seenProg = new Set<string>();
  for (const p of progs) {
    if (seenProg.has(p.slug)) await db.programs.delete(p.id);
    else seenProg.add(p.slug);
  }

  const posts = await db.posts.toArray();
  const seenPost = new Set<string>();
  for (const post of posts) {
    if (seenPost.has(post.slug)) await db.posts.delete(post.id);
    else seenPost.add(post.slug);
  }

  const enrollments = await db.enrollments.toArray();
  const seenEnroll = new Set<string>();
  for (const e of enrollments) {
    if (seenEnroll.has(e.programId)) await db.enrollments.delete(e.id);
    else seenEnroll.add(e.programId);
  }
}

export async function seedDatabase() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    await dedupeDatabase();
    const existingProfile = await db.ownerProfile.get("owner");
    const catCount = await db.categories.count();
    if (existingProfile && catCount > 0) return;
    await runInitialSeed();
  })();
  return seedPromise;
}

async function runInitialSeed() {
''' + body + "\n}\n"

p.write_text(prefix + new_tail, encoding="utf-8")
print("seed.ts updated OK")
