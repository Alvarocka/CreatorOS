# CreatorOS

CreatorOS is a mobile-first creative operating system for capturing, organizing, revisiting, editing, and publishing creative work from one place.

The product idea is simple:

> creativity gets lost when it stays scattered.

This MVP centralizes text, notes, links, files, audio, images, videos, projects, tags, public profile sharing, and contextual work notes inside one responsive web app.

## What is included

- Landing page with real product copy
- Auth flow with Supabase Auth
- Dashboard with recent, favorites, uncategorized, active projects, and ready-to-publish content
- Library with grid/list, filters, sorting, and search
- Creative item create/edit/detail flow
- Project create/edit/detail flow
- Tags and project assignment
- Public profile at `/u/[username]`
- Public share pages for items and projects
- Item notes workspace with optional timestamps
- Compact bottom media player for audio review while writing
- Support for external video embeds such as public Sora share links
- Supabase SQL migration with RLS and Storage policies

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- React Hook Form + Zod
- Zustand for compact player UI state
- Supabase Auth + Postgres + Storage
- Vercel-ready structure

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create your env file

```bash
cp .env.example .env.local
```

3. Fill these variables in `.env.local`

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

4. Run the SQL migration in Supabase

Path:

`supabase/migrations/20260319233000_creatoros_init.sql`

You can paste it in the Supabase SQL editor or run it with the Supabase CLI if you already use one in your workflow.

5. Start the app

```bash
npm run dev
```

6. Open the app

[http://localhost:3000](http://localhost:3000)

## Sora video support

CreatorOS accepts public video links inside `video` items.

- If the URL is a direct video file, the app renders a native HTML5 video player.
- If the URL looks like a public Sora share link, the app attempts to render it in a smaller embedded iframe-style player inside the item view and public share page.
- If embedding is blocked by the source site, the UI still exposes the original link as a fallback.

Recommended workflow:

1. Create a new item with type `video`
2. Paste the public Sora share URL in the main media field
3. Set visibility to `public` if you want it on your public profile or public item page

## Project structure

```text
src/
  app/
    (auth)/               auth pages
    (app)/                protected workspace pages
    share/                public share routes
    u/                    public profile routes
  components/
    ui/                   primitive reusable components
    layout/               shell, nav, quick capture, media player
    forms/                RHF + Zod driven forms
    items/                item cards, actions, notes
    projects/             project cards and actions
    marketing/            landing sections
    profile/              public profile components
    search/               search result surfaces
    shared/               reusable higher-level building blocks
  lib/
    actions/              server actions
    constants/            domain constants
    data/                 query layer and view shaping
    supabase/             SSR/browser/middleware clients
    types/                database and app types
    utils/                helpers and parsers
    validations/          Zod schemas
  providers/
  store/
docs/
  architecture.md
supabase/
  migrations/
```

## Main domain model

- `profiles`
- `creative_items`
- `projects`
- `tags`
- `creative_item_tags`
- `creative_item_notes`
- `public_shares`

`creative_item_notes` is the extra table that powers mental notes, references, lyrics, and timestamped observations per piece.

## UX details built into the MVP

- Quick capture floating action
- Mobile-first shell with bottom navigation
- Dashboard summary cards
- Library filters for type, status, visibility, favorites, project, tags
- Private/public visibility model
- Compact audio workspace player for write-while-listening use cases
- Embedded external video surface for public share links such as Sora

## Security

The migration includes RLS policies for:

- user-owned rows
- public profiles
- public items/projects
- public shares
- restricted storage access with support for public shared assets

## Deployment

Recommended deployment target: Vercel.

Before deploying:

- configure the same env variables in Vercel
- make sure the migration has been applied in Supabase
- create a redirect-safe `NEXT_PUBLIC_APP_URL`

## Future phases

### Product upgrades

- Audio transcription with background jobs and synchronized lyrics/notes
- OCR for image uploads and searchable extracted text
- AI-assisted tag suggestions from title, body, transcript, and media metadata
- Graph relationships between pieces: sequel, remix, reference, source, derivative
- Content versioning and snapshot history
- Public feeds and richer publishing formats

### Native mobile phase

- Expo / React Native app reusing the same Supabase backend
- Mobile-first capture for camera, voice memo, and share-sheet ingestion
- Offline draft queue with sync on reconnect

## Notes

- This repo is structured to be clear and scalable rather than over-engineered.
- If Supabase env vars are missing, the UI shows a friendly setup notice instead of crashing.
- The public embed behavior for third-party video links depends on the provider allowing iframe rendering.
