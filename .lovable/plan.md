

## Phoenix Brain Compass — Clinical Edition

A 3D interactive neuroanatomical atlas added to the Growth Resources page, showing exactly which brain regions TBI affects and how those changes manifest in daily life — linked back to manuscript chapters and protocol tools.

### Where it lives

- **Entry point**: New flagship card at the **top** of `/resources` (above "Featured Influences"), styled as a premium clinical hero — dark glassmorphic card with a "Launch Brain Compass" CTA so it stands out from the warm orange resources cards.
- **Full experience**: New route `/brain-compass` with the interactive 3D viewer.

### New files

**1. `src/pages/BrainCompass.tsx`** — Full-screen clinical viewer
- Dark mode `#0A0A0A` base with cool clinical blue (`#3b82f6`) and amber (`#f59e0b`) accents
- Layout: 3D canvas left/center, glassmorphic floating info card right (stacks on mobile)
- Persistent "Not medical advice — consult your neurologist" disclaimer banner at top
- Region selector chips + tap-on-3D-region both work
- Back link to `/resources`

**2. `src/components/brain-compass/BrainCompass3D.tsx`** — R3F scene
- `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` + `three@>=0.133` (versions per project rules)
- Brain represented as a stylised anatomical mesh built from primitives (spheres/lobed geometries positioned to MNI-152-inspired anatomy) — no external GLB needed, keeps bundle light and offline-cacheable
- 7 selectable region meshes color-coded; soft emissive glow on hover/selected
- `OrbitControls` with damping, pinch-zoom, single-finger orbit; auto-rotate slowed when Fog Day flag set
- 60 fps target with `frameloop="demand"` on idle; `dpr={[1,2]}` cap

**3. `src/components/brain-compass/RegionInfoCard.tsx`** — Clinical info panel
- Glassmorphic card showing for selected region:
  - Anatomical name + 1-line primary function
  - Common TBI sequelae (1–2 sentences, manuscript voice)
  - Evidence note (2025 meta-analysis style, 1 line)
  - Two action links: relevant manuscript chapter + relevant protocol/quest
- 18–20px text minimum, high contrast amber-on-dark

**4. `src/data/brainRegions.ts`** — Clinically grounded region dataset
The 7 regions from the spec, each with: id, label, position, color, function, tbiSequelae, evidenceNote, manuscriptLink (e.g. `/chapter-6`, `/chapter-11`), protocolLink (e.g. `/breathing`, `/mind`, `/daily-protocol`).

**5. `src/components/brain-compass/FogDayFallback.tsx`** — Accessibility mode
- Detects Fog Day state (existing localStorage flag from Fog Day mode memory)
- Shows 2D labelled SVG diagram (reuse style from `AnimatedNeuralBrain`) + voice-over button (Web Speech API `speechSynthesis`) instead of 3D scene
- Toggle in header lets any user switch manually

### Resources page changes

`src/pages/Resources.tsx` — insert new clinical hero card above the "Featured Influences" card:
- Dark gradient (`from-slate-900 to-blue-950`) breaking the warm orange theme deliberately to signal clinical tier
- Brain icon + title "Phoenix Brain Compass — Clinical Edition"
- 1-paragraph pitch + "Launch Brain Compass" button → `/brain-compass`
- Small "Beta — Not medical advice" pill

### Routing

`src/App.tsx` — add public route `<Route path="/brain-compass" element={<BrainCompass />} />` (public so guests can explore).

### Dependencies to install

- `three@^0.160.0`
- `@react-three/fiber@^8.18.0`
- `@react-three/drei@^9.122.0`

### Out of scope (future)

- AI Companion personalisation tie-in ("Your 7-day focus score…") — stubbed with static copy now; can wire to `phoenix-companion` edge function later
- Real MNI-152 NIfTI loader — current stylised mesh is the credible MVP; swap for a true GLB atlas in a follow-up if desired

