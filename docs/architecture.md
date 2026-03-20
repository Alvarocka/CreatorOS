# CreatorOS Architecture

## Product Direction

CreatorOS is a personal creative operating system built around one core promise:

> creativity should not get lost because it lives in too many places.

The MVP focuses on three jobs:

1. Capture ideas quickly from any format.
2. Organize a living archive so it can be found and reused.
3. Publish selected work publicly without duplicating content.

## Technical Architecture

### Frontend

- Framework: Next.js App Router with TypeScript
- Styling: Tailwind CSS with a shadcn-style component layer
- Forms: React Hook Form + Zod
- State:
  - Server state: Next.js server components + server actions
  - Local UI state: Zustand for the compact media player and quick interactions

### Backend

- Supabase Auth for authentication and session persistence
- Postgres for relational data
- Supabase Storage for media and file uploads
- RLS on all user-owned tables

### Design Principles

- Mobile-first layouts with desktop refinement
- Fast navigation with clear hierarchy
- A creative studio feel: warm, editorial, clean, precise
- Read/write surfaces designed for revisiting and reworking old content

## Route Map

### Marketing

- `/` landing page

### Auth

- `/login`
- `/signup`
- `/reset-password`

### App

- `/dashboard`
- `/library`
- `/search`
- `/items/new`
- `/items/[id]`
- `/projects`
- `/projects/[id]`
- `/settings`

### Public

- `/u/[username]`
- `/share/item/[slug]`
- `/share/project/[slug]`

## Domain Model

### Core Entities

- `profiles`
- `creative_items`
- `projects`
- `tags`
- `creative_item_tags`
- `creative_item_notes`
- `public_shares`

### Why `creative_item_notes` Exists

Every creative asset can accumulate context over time: lyrics, timestamps, revision ideas, performance notes, production notes, references. A separate notes table keeps the base item clean while enabling:

- timestamped notes for audio/video
- lyric/reference/general note types
- future collaborative comments or versioning

## App Layers

### `src/app`

Route entrypoints, layouts, loading states, and page composition.

### `src/components`

Reusable presentation components split by concern:

- `ui`: primitive building blocks
- `layout`: app shell, navigation, quick capture, media player
- `marketing`, `dashboard`, `library`, `items`, `projects`, `profile`, `search`

### `src/lib`

Business and integration layer:

- `actions`: server actions for mutations
- `data`: queries and view-model shaping
- `supabase`: browser/server/middleware clients
- `types`: database and app types
- `validations`: Zod schemas
- `constants` and `utils`

### `src/store`

Small local stores for transient UI interactions such as the compact player.

## Key UX Systems

### 1. Quick Capture

A floating primary action is visible across the private app. It routes into the create flow with a preselected item type so capture happens in one or two taps.

### 2. Library Workspace

The library is the operational center for browsing the archive:

- grid/list view
- filters
- ordering
- favorite toggle
- access to project and tag context

### 3. Item Detail Workspace

The item detail page is both archive and studio:

- editable metadata
- main content editor
- related project and tag controls
- note stream for mental/reference notes
- compact bottom player for audio/video review while writing

### 4. Public Layer

Each public item or project gets a shareable URL. The public profile acts like a personal creative window without exposing private workspace tooling.

External public video links, including shared Sora videos when the source URL is embeddable in-browser, are treated as first-class creative items and rendered in a smaller embedded player surface.

## Scalability Notes

The architecture is intentionally prepared for:

- audio transcription
- OCR on image uploads
- AI-assisted tagging
- graph relationships between pieces
- version history
- native mobile client on Expo/React Native reusing Supabase and domain rules
