## Cinematic 3D Hero — Chapter 1 (Showcase)

Bring the Chapter 1 "Australia Day" hero to life with the selected **Layered depth + focus pull** direction. Treat it as a prototype on a single chapter; if approved, roll the pattern out to other chapter heroes later.

### What the user will see

Visiting `/chapter-1` (motion enabled):
- The existing farm hero image is split into **three parallax depth planes**: deep background (sky/distant trees, slowest), midground (dam/farm), foreground (tree silhouettes/skateboard area, sharpest, most responsive).
- **Mouse-driven parallax**: cursor movement shifts each plane on a different axis — max ~12px on foreground, ~6px mid, ~3px back. Subtle, slow, easeOut.
- **Scroll-driven dolly-in**: scrolling down zooms the planes inward at different rates, creating depth as the user enters the article.
- **Slow ambient breathing**: each layer has a 20–25s alternating ken-burns drift, independent per plane.
- **Layered embers** travel on the foreground plane (closer = bigger, faster).
- **Golden hour glow** radial gradient pulses subtly behind the title.
- Existing **Home button, Listen button, chapter nav arrows, kicker, title, pull-quote** stay exactly as-is in position and typography. Glassmorphism preserved.

Visiting with `prefers-reduced-motion`, Fog Day mode, OR the new settings toggle off → falls back to the current static hero (single flat image, embers off, ken-burns off).

### Settings toggle

Add a single switch in `/settings`:
- **Label**: "Cinematic 3D hero"
- **Helper**: "Animated depth and parallax on chapter cover images. Turn off to reduce motion and save battery."
- **Storage**: `localStorage` key `cinematic-3d-enabled` (default `true` unless `prefers-reduced-motion` is set, then `false`).
- Exposed via a tiny hook `useCinematic3D()` returning the resolved boolean.

### Technical details

**New files**
- `src/hooks/use-cinematic-3d.ts` — reads the localStorage flag, watches `prefers-reduced-motion`, returns `enabled: boolean`. Also exports `setCinematic3DEnabled(v)`.
- `src/components/cinematic/CinematicHero.tsx` — the reusable 3D hero. Props: `image`, `kicker`, `title`, `quote`, `alt`. Renders 3 layered divs using the SAME `image` (the existing `chapter1-hero.jpg`) with different `scale`, `translate`, and animation timings to fake depth from a single asset. Uses `requestAnimationFrame` + `mousemove` listener (throttled) for parallax, and `IntersectionObserver` + scroll for the dolly. When `useCinematic3D()` returns `false`, returns the existing static `<img>` markup as-is.
- `src/index.css` — append three `@keyframes` (`cinematic-zoom`, `cinematic-drift`, `cinematic-ember-float`) scoped under `@media (prefers-reduced-motion: no-preference)`.

**Edited files**
- `src/pages/Chapter1.tsx` — replace the current `<section>` hero (image + overlays + kicker/title/quote block) with `<CinematicHero image={chapter1Hero} kicker="Chapter One · 26 January 2024" title="Australia Day" quote='"This is what life'\''s all about." — A fleeting thought, before the blackness.' alt="..." />`. Keep `<PageAudioPlayer>`, `<ChapterNavArrows>`, SEO, schema, the Home button overlay, and the article body untouched.
- `src/pages/Settings.tsx` — add a new "Display" section with the toggle wired to `setCinematic3DEnabled`.

**Performance**
- Single image asset reused across 3 layers (no extra network).
- All transforms on `transform`/`opacity` only, `will-change: transform` on layers, `transform-gpu`.
- Parallax listener attached only when enabled; removed on unmount.
- Throttled to `requestAnimationFrame`.
- Auto-disables under `prefers-reduced-motion`, Fog Day mode (read from existing localStorage flag if present), and the new toggle.

**Out of scope (this round)**
- Other chapter pages (2–21). Only Chapter 1 is wired up.
- WebGL/Three.js depth-map version.
- True AI-generated depth map; we fake depth via layered transforms of the same image, which is convincing enough for the showcase and ships in one pass.

### Acceptance

- `/chapter-1` shows the layered parallax hero with cursor + scroll response.
- Toggling "Cinematic 3D hero" off in `/settings` immediately falls back to the original static hero on next visit/refresh.
- `prefers-reduced-motion: reduce` forces static even when toggle is on.
- No layout shift, no overlap on Home / Listen / nav arrows / title / quote.
- Lighthouse performance on `/chapter-1` does not regress more than 3 points.
