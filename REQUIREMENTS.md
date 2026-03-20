# CreatorOS Requirements

This repo implements CreatorOS as a local-first native mobile workspace inspired by the product brief in `/Users/rocka/Downloads/creatorOS codex prompt.pdf`.

## Core Product
- Multimedia documentation tool for neurodivergent creatives.
- Focus on tablet and mobile.
- Local-first storage on device.
- No required cloud sync in the primary mobile flow.

## Primary Workflow
1. Quick Capture opens from a prominent floating button.
2. User uploads audio, video, or image, or records audio directly.
3. User adds an initial note, title, description, and tags.
4. CreatorOS creates a multimedia document.
5. In the editor, the user writes while media plays in a compact bottom player.
6. User inserts timestamps, marks, highlights, and quick ideas while listening/watching.

## Editor Expectations
- Tablet-first split layout.
- Right panel for metadata and media management.
- Bottom player with time, skip, rate controls, mute, and waveform/timeline.
- Auto-save to local persistence.
- Export to TXT, Markdown, and PDF.

## Out of Scope
- Mandatory auth
- Cloud sync as the main storage mode
- Public profile shipping now
- Audio/video editing
- Format conversion
