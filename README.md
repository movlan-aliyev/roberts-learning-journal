# Robert's Learning Journal

**Learn something. Understand it. Make it your own.**

Personal learning website: public journal + private daily study workspace with seven skill programs, spaced repetition, assessments, and a daily lesson pipeline.

## Quick start (local demo)

```bash
cd roberts-learning-journal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Owner login PIN:** `1234` (demo mode)
- Data persists in browser IndexedDB across reloads
- No cloud credentials required for core flows

## What works locally

| Feature | Status |
|---|---|
| Public journal, explore, topics, about | Working |
| Post editor with autosave, preview, publish | Working |
| Books & films shelf + reviews | Working |
| 7 learning programs + lesson player | Working |
| In-page quizzes + completion tracking | Working |
| Spaced repetition reviews | Working |
| Daily lesson preparation (idempotent) | Working (manual + on Today open) |
| Export / import JSON backup | Working |
| Dark mode | Working |

## Deploy to GitHub Pages

1. Create a repo under [github.com/movlan-aliyev](https://github.com/movlan-aliyev) named `roberts-learning-journal`
2. Push this folder to `main`
3. Enable **Settings → Pages → GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` builds and publishes to:
   `https://movlan-aliyev.github.io/roberts-learning-journal/`

For a root site like `https://movlan-aliyev.github.io/`, push to the `movlan-aliyev.github.io` repo and set `NEXT_PUBLIC_BASE_PATH=` (empty).

## Still needs configuration (hosted)

| Integration | What's needed |
|---|---|
| **Supabase** (optional cloud DB/auth) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Content AI provider** (optional) | `CONTENT_PROVIDER_API_KEY` — without it, authored local lessons are used |
| **Scheduled daily prep** | Repo secrets + Actions enabled; workflow: `.github/workflows/prepare-daily.yml` (cron `:17` UTC ≈ prep before 7 AM ET) |
| **Real owner auth** | Replace demo PIN with Supabase Auth or GitHub OAuth before public deploy |

Demo-owner PIN login must **never** be enabled on a public production deployment.

## Scripts

```bash
npm run dev      # local preview
npm run build    # static export → out/
npm run lint     # eslint
```

## Architecture

- **Next.js App Router** + TypeScript + Tailwind CSS 4
- **Dexie / IndexedDB** local persistence (demo mode)
- Static export for GitHub Pages
- Server-side repository layer ready for Supabase swap
- Curriculum seed: 7 programs, week-1 authored units, sample flag/science posts, flashcards
