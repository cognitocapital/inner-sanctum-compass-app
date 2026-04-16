

## Plan: Move video intro to Introduction, add Listen button to Prologue

### What's changing

Currently the "Start Reading" video plays on the **Prologue** page before showing text. The user wants to move this video intro to the **Introduction** page instead, and give Prologue a standard Listen button like all other chapters.

### Changes

**1. `src/pages/Introduction.tsx`**
- Add `useState` for `showIntro` (like Prologue currently has)
- When `showIntro` is true, show the fullscreen video (`/video/start-reading-intro.mp4`) with `object-contain`
- When video ends, transition to the chapter text
- Remove `PageAudioPlayer` from the text view (the video replaces it)

**2. `src/pages/Prologue.tsx`**
- Remove the `showIntro` state and video intro block entirely
- Move `PageAudioPlayer` into the main content return (alongside `ChapterNavArrows` and `SEOHead`), so it appears as a standard Listen button like all other chapters
- Remove `useState` import if no longer needed

**3. Update navigation**: The "Start Reading" button on Dedication currently links to `/prologue`. Check if it should now link to `/introduction` instead — but since the reading order is Prologue → Introduction, the link stays at `/prologue`. The video intro will play when users navigate from Prologue to Introduction.

