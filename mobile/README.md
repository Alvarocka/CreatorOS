# CreatorOS Mobile

Native mobile phase for CreatorOS built with Expo and Expo Router.

This mobile app is designed for the moments when the idea appears before you get back to your laptop:

- quick text, note, and link capture
- native auth with Supabase
- dashboard snapshot
- library preview
- projects preview
- mobile settings and sign out

## Setup

1. Copy envs

```bash
cp .env.example .env
```

2. Fill:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Start Expo

```bash
npm install
npx expo start
```

## Android APK preview

This folder already includes `eas.json` with a `preview` profile configured to output an installable APK.

Typical flow:

```bash
npx eas login
npx eas build --platform android --profile preview
```

## Current scope

- email/password auth
- session persistence on device
- native tabs
- CreatorOS-themed mobile UI
- quick capture for `text`, `note`, and `link`
- Supabase-backed dashboard, library, and projects

## Next native milestones

- image and document capture
- voice memo capture
- offline draft queue
- push notifications
- public share preview inside the app
