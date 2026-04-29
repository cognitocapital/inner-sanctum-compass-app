

# Hospital-Grade Clinical Platform — Implementation Plan

**Decision:** Full validated assessment battery first. B2B serves clinicians, clinics, hospitals, and research — start with individual-clinician flow and design schema to scale to org accounts. Cinematic Phoenix design language preserved; clinical surfaces use a calmer, denser, "EMR-credible" variant of the same tokens (amber → muted teal/slate accent for clinician views, glass cards retained but tightened).

## Why the current state isn't hospital-grade
- Only GOSE is implemented; PHQ-9/RPQ are stubs in `ASSESSMENT_INFO` with no scoring engine, no severity bands, no longitudinal trend, no MCID, no red-flag detection.
- No suicidality/safety routing on PHQ-9 Q9.
- No structured FHIR-shaped export, no PDF, no audit trail.
- No clinician role; everything is patient-only RLS.
- No instrument metadata (versioning, copyright/attribution, scoring rules, normative bands) — required for credibility.

## Slice 1 — Validated assessment battery (this turn after approval)

### Instruments (all self-administered, evidence-based, public-domain unless noted)
1. **RPQ-16** (Rivermead Post-Concussion Symptoms Questionnaire) — 16 items, 0–4 each, RPQ-3 + RPQ-13 subscores, severity bands.
2. **PHQ-9** (Patient Health Questionnaire-9) — 9 items, 0–3, depression severity bands (0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 mod-severe, 20–27 severe). **Q9 suicidality auto-flag → safety modal with 988 / Samaritans / local crisis lines.**
3. **GAD-7** — anxiety, 7 items, severity bands.
4. **PCL-5** — PTSD, 20 items, DSM-5 cluster scoring (B/C/D/E), provisional diagnosis flag.
5. **NSI-22** (Neurobehavioral Symptom Inventory) — 22 items, 4 domain subscores (vestibular, somatic, cognitive, affective). Validation flag (Validity-10 subset).
6. **GOSE** — already built; refactor onto new engine.

### Scoring engine (`src/lib/clinical/`)
- `instruments/{rpq,phq9,gad7,pcl5,nsi22,gose}.ts` — each exports `{ id, version, items[], scoring(answers), severity(score), interpret(score), redFlags(answers), mcid }`.
- `types.ts` — shared `Instrument`, `InstrumentResponse`, `Severity`, `RedFlag`.
- `mcid.ts` — minimum clinically important differences (RPQ MCID ≈ 8.5, PHQ-9 ≈ 5, GAD-7 ≈ 4, PCL-5 ≈ 10–20).
- `trend.ts` — compute slope, change-from-baseline, MCID-crossed boolean for charts.
- `redFlags.ts` — PHQ-9 Q9 ≥1, PCL-5 cluster thresholds, NSI Validity-10.

### UI components (`src/components/clinical/`)
- `AssessmentRunner.tsx` — generic multi-step questionnaire runner, accessibility-first (large radio targets, audio prompts, brain-break suggestion every 10 items, save-resume), works for all 6 instruments.
- `AssessmentCard.tsx` — per-instrument card showing latest score, severity badge, mini-sparkline, MCID arrow, "retake" / "history".
- `AssessmentBattery.tsx` — replaces stub `ClinicalDashboard` content; grid of 6 instruments + "Take recommended battery" guided flow.
- `ScoreTrendChart.tsx` — recharts line + MCID band shading + clinical severity bands.
- `SafetyModal.tsx` — triggered on Q9 ≥1; shows crisis resources, logs the flag, prompts share-with-clinician.
- `InstrumentInfoSheet.tsx` — copyright, validation citation, intended use, scoring reference, clinician interpretation guidance.
- Refactor `GOSEAssessment.tsx` to use `AssessmentRunner`.

### Data model (single migration)
- Extend `clinical_assessments` with: `instrument_version text`, `responses jsonb` (full per-item answers), `subscores jsonb` (already exists — formalise schema), `interpretation text`, `red_flags jsonb default '[]'`, `mcid_change numeric`, `administered_in text default 'self'` (self|clinician|telehealth).
- New `clinical_red_flag_events` table — flag type, instrument_id ref, severity, acknowledged_at, resolved_at. RLS owner-only (clinician access added in Slice 2).
- New `clinical_audit_log` table — `actor_id`, `action`, `target_type`, `target_id`, `metadata jsonb`, `ip_address`, `created_at`. Insert-only RLS, owner read.
- New `app_role` enum (`patient`, `clinician`, `admin`, `researcher`) + `user_roles` table + `has_role()` security-definer function. (Lays foundation for Slice 2; not yet enforced beyond patient.)

### Insights tab integration (`src/pages/Insights.tsx`)
- Replace clinical tab content with `AssessmentBattery`.
- Add "Score Trends" sub-tab with `ScoreTrendChart` per instrument.
- Export button extended to include all assessments + red-flag history in clinical report.

### Export upgrade (`supabase/functions/export-clinical-report/index.ts`)
- Pull all `clinical_assessments` grouped by instrument.
- Render trend tables, severity bands, MCID-crossed highlights, red-flag log.
- Add structured FHIR-shaped JSON export option (`Observation` resources per assessment).

## Slice 2 — Clinician portal (next phase, not this turn)
- Clinician signup → `clinician` role assigned via invite/admin approval.
- Patient invite-by-code linking table (`patient_clinician_links`).
- Caseload dashboard, alert inbox, audit log viewer.
- RBAC RLS: clinicians read linked patients' assessments via `has_role` + link check.
- Org accounts schema (`organizations`, `org_members`) ready but unused.

## Slice 3 — Compliance & deployment polish (later)
- MFA, session timeout, consent capture screen, BAA-readiness doc, signed PDF exports, scheduled clinician email digest.

## What I will NOT touch
- Phoenix Path cinematic UI, audiobook player, soundscapes, manuscript content, AI Companion behaviour, brand/visual system. Clinical work lives behind `/insights` clinical tab and a new `/clinical` route.

---

## Prior plan (Brain Compass) — kept for reference

(Original Brain Compass plan retained below.)

---

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

