

The user re-pasted the brief with explicit file list. Most of this aligns with my prior plan. New nuances: "artist.io voice-over" (likely meant ElevenLabs/realistic TTS rather than browser SpeechSynthesis), opt-in encrypted storage flag (`profiles.personal_scan_optin`), and "regions viewed" logging table. DB already has `brain_scan_uploads`, `brain_scan_markers`, `ai_companion_logs` — good. Need a new `brain_region_views` table + `personal_scan_optin` column. Voice-over: I'll use browser SpeechSynthesis as default (offline, free, Fog-Day appropriate) and note ElevenLabs as a follow-up since it requires an API key + cost.

# Phoenix Brain Compass — 2026 Clinical Upgrade

## What ships

A bespoke offline-first 3D atlas with ~60 clinically-curated regions, every one tied to a manuscript chapter, Daily Protocol step, soundscape, and live AI Companion seed. Personal scan overlay gets a real opacity slider, 56px taps, DICOM/NIfTI guidance, and opt-in encrypted persistence. Fog Day swaps to a calm labeled SVG with voice-over. Safety banners on every screen. Region views logged for future personalisation.

## Build

**1. Expand atlas → ~60 regions** (`src/data/brainRegions.ts`)
Add subcortical (hippocampus L/R, thalamus L/R, caudate, putamen, globus pallidus, amygdala L/R, nucleus accumbens, substantia nigra, PAG), brainstem (midbrain, pons, medulla, locus coeruleus, raphe), vestibular nuclei, cerebellar lobes (vermis, flocculus, posterior), DMN (PCC, precuneus, mPFC, angular), salience (insula L/R, dACC), executive (DLPFC L/R, VLPFC), language (Broca, Wernicke, arcuate), visual (V1, V4, MT), white-matter (corpus callosum splenium/genu, fornix, uncinate). New fields per region: `soundscapeId`, `dailyProtocolStep`, `aiSeedPrompt` (already partially present — extend uniformly).

**2. Live AI Companion wiring** (`RegionInfoCard.tsx`)
Already has `askPhoenix` streaming. Extend the request body to include last 3 `daily_checkins` + last `session_logs` row + region's `aiSeedPrompt`. Add a soundscape quick-link button next to manuscript/protocol.

**3. Scan overlay upgrade** (`PersonalScanOverlay.tsx`)
- Replace number inputs with `Slider` for opacity (0–100%).
- 56px min tap targets on pins + controls.
- DICOM/NIfTI file detection → friendly modal with link to free converter (e.g. MicroDicom, dcm2niix).
- Reuse existing `brain-scans` bucket + `brain_scan_uploads`/`brain_scan_markers` tables for opt-in persistence.
- Default: session-only in-memory; only persist if `profiles.personal_scan_optin = true`.
- Persistent footer banner: "Not diagnostic. Visualisation only."

**4. Fog Day 2D diagram + voice-over** (`FogDayFallback.tsx`)
Rewrite as labeled SVG (sagittal + coronal split view) showing 12 high-traffic regions with 56px tap zones. Add "Listen" button per region using browser `SpeechSynthesis` to read TBI-impact aloud (offline, free). Note: ElevenLabs/realistic TTS is a follow-up (needs API key + cost) — browser TTS keeps Fog Day fully offline.

**5. Region view logging**
New table `brain_region_views` (user_id, region_id, viewed_at) with insert-only RLS for own user. Fire-and-forget insert when a region card opens (signed-in users only).

**6. Persistent safety banners** (`BrainCompass.tsx`)
Top banner exists. Add a slimmer footer banner pinned across all states (atlas, scan overlay, Fog Day): "Educational visualisation only — not diagnostic. Consult your neurologist."

**7. Offline cache** (`vite.config.ts`)
Add `/brain-compass` route + region data to PWA precache `globPatterns`.

## Database migration

```sql
-- Opt-in for scan persistence
ALTER TABLE profiles ADD COLUMN personal_scan_optin boolean NOT NULL DEFAULT false;

-- Lightweight region view log
CREATE TABLE brain_region_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  region_id text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE brain_region_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insert" ON brain_region_views FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own select" ON brain_region_views FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX brain_region_views_user_idx ON brain_region_views(user_id, viewed_at DESC);
```

## Confirmed decisions (carry-over)

- **Mesh**: keep procedural (offline, <0.1MB). No glTF download.
- **Regions**: ~60 curated > 200 generic. Every entry has real links.
- **DICOM/NIfTI**: detect + guide users to convert (no client-side parser).
- **Storage**: session-only by default; opt-in encrypted persistence via existing private `brain-scans` bucket.
- **Voice-over**: browser SpeechSynthesis (offline). ElevenLabs noted as future upgrade.

## Files touched

- `src/data/brainRegions.ts`
- `src/components/brain-compass/RegionInfoCard.tsx`
- `src/components/brain-compass/PersonalScanOverlay.tsx`
- `src/components/brain-compass/FogDayFallback.tsx`
- `src/pages/BrainCompass.tsx`
- `vite.config.ts`
- New migration (above)

## Out of scope

- Real glTF MNI mesh (deferred — would break offline-first).
- Client-side NIfTI parsing (deferred — bundle + edge cases).
- ElevenLabs TTS (deferred — cost/API key).
- Auto-lesion detection (manual marker is the spec).

