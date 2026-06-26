# STANDING-RULES.md

> **This file governs the Phoenix Journey redesign.** Every redesign change must open this file and follow it. Each slice prompt begins with "open and follow STANDING-RULES.md" so these rules load from the repo on every change — no external settings, nothing to keep in sync. Commit this to the repo root. Do not delete it until the redesign is complete.

---

## The Vision (the judge of every decision)

For anyone rebuilding life after a brain injury: a companion forged from one survivor's story. It remembers what you can't, and turns that into your next step forward — so even on the foggiest day, a frightening, non-linear road becomes a path you can actually see. Carers and clinicians gather around that survivor, never in front of them.

## The only top-level shape — five rooms, nothing more

- **Today** — one guided home: a single suggested step + check-in
- **Practice** — self-directed doing (*Calm:* breathing / soundscapes / cold; *Train:* mind / rehab)
- **Progress** — the clinical home: assessments, trends, brain compass, share-with-clinician
- **Companion** — Phoenix chat
- **Book** — the memoir

Do **not** add top-level destinations. There is exactly **one** home: Today.

## Invariants — never violate

1. **One action at a time.** Today shows exactly one tappable step. Everything else is glanceable, not actionable.
2. **The path orients, the step acts.** "Where am I" is ambient and never a menu; the single suggested step is the only thing asking to be tapped.
3. **Never recreate competing homes.** The old quest-map and 20-week-protocol landing pages are being retired into Today. Never reintroduce either as a home/dashboard.
4. **Clinical is promoted, never buried.** Assessments, trends, brain compass, and clinician-sharing live at the top level, in Progress.
5. **One source of truth for progress.** Never write `phoenix_phase` or `flame_strength` as independent truth. Position derives from one place only.
6. **One slice per change.** Touch only the files named in the current prompt. No "while I'm here" edits.
7. **Safety paths are sacrosanct** — never weaken: the cold-exposure safety gate, the companion crisis-detection + clinician alerts, and RLS on patient-data tables.

## Do not disturb (already strong, leave working)

Companion + crisis system · cold-exposure safety gate · RLS coverage · validated instruments (PHQ-9 / GAD-7 / RPQ / NSI / PCL-5 / GOSE) · the onboarding gate in `PhoenixPath`.

## How to work

- **Plan in chat first.** Show the plan; wait for "go" before writing code.
- **End every change with STOP, and show the diff.** Do not start the next slice.
- **Keep the preview green between slices.** Never stack two unreviewed changes.
- **Data/DB migrations come last.**
- **If a change would touch a file not in the current scope, STOP and ask instead.**