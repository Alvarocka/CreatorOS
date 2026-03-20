# CreatorOS — AGENTS.md

## Project
CreatorOS mobile is a tablet-first, local-first multimedia documentation tool for neurodivergent creatives.
Primary flow: Quick Capture -> multimedia document -> write while media plays.

## Working Agreements
- Keep the core workflow local-on-device by default.
- Prioritize tablet usability without sacrificing phone ergonomics.
- Run `npm run typecheck`, `npm test`, and `npm run lint` after significant mobile changes.
- Do not reintroduce mandatory auth or cloud storage into the native capture flow.
- When the spec is ambiguous, favor the document editor and playback workflow over peripheral features.

## Code Standards
- TypeScript strict mode only.
- Functional components with typed props.
- Avoid `any`.
- Centralize visual tokens in `mobile/src/lib/theme.ts`.
- Prefer pure helpers for formatting, validation, export, and persistence logic.

## Product Priorities
1. Quick Capture must be obvious and fast.
2. The document editor is the heart of the app.
3. Media playback must stay non-intrusive.
4. Public profile remains placeholder-only until the documentation flow is excellent.
