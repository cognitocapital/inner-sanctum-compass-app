

# The Phoenix Path -- Refined Implementation Plan

## Overview

Transform the platform from a linear 20-week protocol into **The Phoenix Path** -- a flexible, quest-based recovery system with four phases (Ashes, Forge, Ascent, Soar). The book "What a Journey" is the emotional backbone, not just content to convert. Users choose quests freely within their phase, with a "Flame Strength" momentum system replacing rigid phase gates.

---

## Architecture: How It Works

The existing `protocolWeeks.ts` (20 weeks of linear chapter + breathing + challenge + reflection) gets decomposed into ~100 individual quests spread across 4 phases. Users pick and complete quests in any order within their current phase. A "Flame Strength" meter (not a strict gate) determines phase progression -- low-energy days don't lock users out, they just suggest gentler quests.

```text
Phase 1: THE ASHES (Survival & Awakening)
  Chapters 1-4 narratives, basic breathing, grounding, first gratitude
  Accent: dark gray + amber embers

Phase 2: THE FORGE (Rebuilding & Emotional Work)  
  Chapters 5-9 narratives, emotional awareness, cognitive training, nutrition, decisions
  Accent: deep orange + red forge glow

Phase 3: THE ASCENT (Independence & Inner Work)
  Chapters 10-13 narratives, observer practice, mindfulness, independence, gratitude depth
  Accent: gold + warm white

Phase 4: THE SOAR (Legacy & Thriving)
  Chapters 14-15+ narratives, meaning-making, vision, advocacy, mentoring, "My Phoenix Chapters"
  Accent: bright orange + sky blue + flying phoenix
```

---

## Phase 1 MVP: Build Order (7 Steps)

### Step 1: Database Migrations

**New table: `phoenix_quests`**
- `id` (uuid, PK)
- `user_id` (uuid, not null)
- `quest_key` (text) -- e.g., "narrative_ch1", "breathing_box", "toolkit_energy_budget"
- `quest_type` (text) -- narrative, breathing, cold, cognitive, mindfulness, reflection, toolkit, echo
- `phase` (integer, 1-4)
- `status` (text) -- locked, available, in_progress, completed
- `xp_reward` (integer, default 50)
- `completed_at` (timestamptz, nullable)
- `metadata` (jsonb, default '{}') -- quest-specific data (reflection text, scores, etc.)
- `book_chapter_ref` (integer, nullable) -- links to manuscript chapter number
- `symptom_tags` (text[], default '{}') -- e.g., ['memory', 'fatigue', 'vertigo']
- `created_at`, `updated_at`
- RLS: users CRUD their own rows only

**New table: `user_journal_entries`** (My Phoenix Chapters)
- `id` (uuid, PK)
- `user_id` (uuid, not null)
- `phase` (integer, 1-4)
- `title` (text)
- `content` (text)
- `mood_tag` (text, nullable)
- `is_shared` (boolean, default false) -- for anonymous "echoes"
- `created_at`, `updated_at`
- RLS: users CRUD own; public read where `is_shared = true`

**New table: `resource_directory`**
- `id` (uuid, PK)
- `name` (text)
- `category` (text) -- telehealth, support_group, financial, app, organization, toolkit
- `description` (text)
- `url` (text)
- `region` (text) -- australia, international, global
- `tags` (jsonb, default '[]')
- `is_verified` (boolean, default true)
- `created_at`
- RLS: public read for all

**Update `profiles` table:**
- Add `phoenix_phase` (integer, default 1)
- Add `flame_strength` (integer, default 0) -- momentum meter (0-100 per phase)
- Add `dominant_symptoms` (text[], default '{}') -- for symptom pathway branching

### Step 2: Quest Data Structure

Create `src/data/phoenixQuests.ts` containing all quest definitions. This file maps the manuscript chapters, existing breathing patterns, challenges, and reflections into quest objects, plus adds new Synapse-inspired toolkit quests.

**Quest categories per phase (approximately):**

| Phase | Narrative | Breathing | Challenge | Reflection | Toolkit | Echo | Total |
|-------|-----------|-----------|-----------|------------|---------|------|-------|
| Ashes (1) | 4 | 4 | 4 | 4 | 3 | 2 | ~21 |
| Forge (2) | 5 | 5 | 5 | 5 | 4 | 2 | ~26 |
| Ascent (3) | 4 | 4 | 4 | 4 | 4 | 3 | ~23 |
| Soar (4) | 4 | 4 | 4 | 4 | 5 | 3 | ~24 |

**New toolkit quests (Synapse-inspired):**
- "Build a Morning Routine Anchor" (Phase 1)
- "Create Your Energy Budget" (Phase 1) -- energy bank account visual
- "Memory System Builder" (Phase 2)
- "Push vs Rest Decision Tree" (Phase 2)
- "Pacing Calendar" (Phase 3)
- "Smoothie Recipe Builder" (Phase 2, taste/smell specific)
- "Weekly Energy Review" (Phase 3)
- "Design Your Personal Protocol" (Phase 4)
- "Write Your Advocacy Story" (Phase 4)
- "Mentor's Guide: Supporting a New Phoenix" (Phase 4)

**New echo quests:**
- "Read a Peer Story" -- shows anonymized journal entries from other users
- "Send Encouragement" -- write a short message attached to a shared story
- "Share Your Chapter" -- share one of your journal entries anonymously

### Step 3: Phoenix Path Map Page

Create `src/pages/PhoenixPath.tsx` -- the signature page replacing `/dashboard`.

**Layout (vertical scrollable timeline, mobile-first):**
- Top: User's flame strength meter + current phase name + XP total
- Scrollable vertical path with 4 phase sections
- Each phase shows as a distinct visual zone (color transitions as you scroll)
- Quest nodes appear as glowing circles along the path (left/right alternating)
- Completed quests: solid orange/gold with check
- Available quests: pulsing ember glow, tappable
- Locked quests (next phase): dimmed with lock icon
- Phase transitions marked by phoenix milestone art (wings unfurling animation on unlock)
- Bottom: Quick access buttons for "My Phoenix Chapters" journal and Directory

**Key interaction:** Tapping a quest node opens a bottom sheet / modal with quest preview (title, type icon, XP value, book chapter reference, estimated time). "Begin Quest" navigates to `QuestView`.

**Flame Strength mechanics:**
- Completing a quest adds flame points (proportional to XP)
- Daily check-in adds flame points
- Missing days gently reduces flame (but never locks phases)
- Reaching 80% flame in a phase shows "Phase Transition" celebration and unlocks next phase
- Users can always revisit earlier phases ("returning to the ashes to rise stronger")

### Step 4: Quest Execution Page

Create `src/pages/QuestView.tsx` -- a universal quest runner.

Based on `quest_type`, renders the appropriate experience:
- **narrative**: Chapter text + audio player (reuses existing `WeeklyChapter` audio pattern) + reflection prompt ("How does this mirror your experience?")
- **breathing**: Guided breathing session (reuses existing `BreathingExercise` page components)
- **cold**: Cold exposure timer (reuses existing `ColdExposure` components)
- **cognitive**: N-Back or decision framework (reuses existing `MindTraining` components)
- **mindfulness**: Guided journaling or meditation prompts
- **reflection**: Text prompt with rich text area, saves to quest metadata
- **toolkit**: Interactive step-by-step exercise (energy budget planner, routine builder, etc.)
- **echo**: Display a peer story + response prompt

On completion: XP animation, flame strength update, toast celebration, return to Phoenix Path with node now glowing gold.

### Step 5: My Phoenix Chapters (Journal)

Create `src/pages/MyPhoenixChapters.tsx` -- personal narrative journal.

- Users write their own story entries parallel to book chapters
- Each entry tagged with current phase
- Option to share anonymously as "echoes" for other users' echo quests
- Simple, clean writing interface (large text area, mood tag selector)
- Entry list view showing all past entries with phase color coding

### Step 6: Resource Directory

Create `src/pages/Directory.tsx` with initial data seed.

**Categories:**
- Organizations: Synapse (synapse.org.au), Brain Injury Australia, IBIA, BrainLine
- Telehealth: listed by region
- Apps: recommended TBI/recovery apps
- Support Groups: online peer communities
- Financial: NDIS info, disability support
- Toolkits: links to Synapse's practical guides

**Features:**
- Search bar with category filter chips
- Region filter (Australia, International)
- Each resource card: name, description, category badge, link, verified badge
- Seeded with ~30 initial resources

### Step 7: Navigation and Rebrand

**Route changes:**
- `/phoenix-path` -- main authenticated hub (new)
- `/quest/:questKey` -- quest execution (new)
- `/my-chapters` -- journal (new)
- `/directory` -- resource directory (new)
- `/dashboard` -- redirects to `/phoenix-path`

**Landing page (`Index.tsx`) updates:**
- Rename "Yellow Brick Road" button to "The Phoenix Path" with phoenix-themed gradient (orange-to-gold)
- Add tagline: "Rising After TBI -- Your personalized roadmap"
- Update CTA styling to match new brand

**Onboarding updates:**
- Add symptom selection step (vertigo, memory, taste/smell, fatigue, emotional, cognitive fog)
- Selected symptoms stored in `profiles.dominant_symptoms`
- Used to pre-recommend relevant quests and surface symptom-specific toolkit quests
- Remove rigid "20-week protocol" language, replace with "Your Phoenix Path"

---

## What Gets Preserved

- All existing chapter pages (`/chapter-1` through `/chapter-21`) remain accessible
- All existing module pages (breathing, cold exposure, mind training, etc.) remain as standalone tools
- Existing `week_progress` table kept for backward compatibility (legacy data)
- Audio files and audiobook player untouched
- All existing UI components (cards, buttons, etc.) reused

## What Gets Replaced

- `/dashboard` page redirects to `/phoenix-path`
- Linear week-by-week progression replaced by quest freedom within phases
- `JourneyRoad.tsx` (linear week nodes) replaced by vertical phase map
- `WeekComplete.tsx` replaced by phase transition celebrations

## Non-Linear Recovery Handling

- No hard phase locks -- flame strength is a gentle momentum meter
- Low-energy days: daily check-in detects low scores and suggests restorative quests (short breathing, gratitude micro-practice, "sit with discomfort" from Chapter 3)
- Regression is celebrated: "Returning to the ashes makes your next rise stronger"
- "Brain break" prompts after 10-15 minutes of active questing

## Files Created

| File | Purpose |
|------|---------|
| `src/data/phoenixQuests.ts` | All quest definitions with book chapter mappings |
| `src/data/directoryData.ts` | Curated resource directory entries |
| `src/pages/PhoenixPath.tsx` | Main journey map page |
| `src/pages/QuestView.tsx` | Universal quest execution |
| `src/pages/MyPhoenixChapters.tsx` | Personal narrative journal |
| `src/pages/Directory.tsx` | Resource directory |
| `src/components/path/PhaseMap.tsx` | Visual vertical path with 4 phases |
| `src/components/path/QuestNode.tsx` | Individual quest node on map |
| `src/components/path/QuestCard.tsx` | Quest preview bottom sheet |
| `src/components/path/FlameStrength.tsx` | Momentum meter component |
| `src/components/path/PhaseTransition.tsx` | Phase unlock celebration |
| `src/components/path/ToolkitExercise.tsx` | Interactive toolkit quest renderer |
| `src/components/directory/ResourceCard.tsx` | Directory resource card |
| `src/hooks/use-phoenix-path.ts` | Quest state + flame strength management |

## Files Modified

| File | Change |
|------|---------|
| `src/App.tsx` | Add new routes, redirect `/dashboard` |
| `src/pages/Index.tsx` | Rebrand button + tagline |
| `src/components/onboarding/OnboardingFlow.tsx` | Add symptom selection, Phoenix Path language |

---

## Future Phases (Not Built Now)

- **Phase 2**: AI-powered quest recommendations using daily check-in data, peer matching, community forums
- **Phase 3**: Carer/supporter view, companion AI, advanced analytics, exportable clinical reports
- **Branding**: "The Phoenix Path by What A Journey" trademark filing

