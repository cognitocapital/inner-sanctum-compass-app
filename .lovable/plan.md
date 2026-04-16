

## Plan: Fix video cropping to show all content

### Problem
- The Prologue intro video uses `object-cover` which crops the video to fill the viewport, cutting off text
- The Dedication video modal already uses `object-contain` implicitly (no object-fit set), but the Prologue fullscreen video does not

### Changes

**1. `src/pages/Prologue.tsx`** — Change video class from `object-cover` to `object-contain`
- This ensures the entire video frame is visible with black letterboxing instead of cropping
- The `bg-black` parent already provides a clean background for any bars

**2. Copy the new uploaded video** to `public/video/start-reading-intro.mp4` (replacing the current file)

### Video creation tip
For future videos, **16:9 (1920×1080)** is the safest ratio — it matches most screens without cropping. If you want it to look good on mobile too, keep all important text/content in the center 80% of the frame (safe zone), away from edges.

