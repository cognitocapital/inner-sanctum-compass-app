# Phoenix Journey Redesign — Build Progress

Status key: ⬜ not started · 🟡 in progress · ✅ done & reviewed

- ✅ Slice 1 — Cuts (delete dead code)
- ✅ Slice 2 — Navigation shell (five rooms, existing pages re-routed)
- ⬜ Slice 3 — Consolidate journaling → one Journal
- ⬜ Slice 4 — Build the new Today (two-layer engine)
- ⬜ Slice 5 — Dissolve the old homes (after Today exists)
- ⬜ Slice 6 — Promote clinical + fold gamification

Open decisions still to confirm:
- A) Rehab modules (ADL/GMT/Spaced-Repetition/Speech) → Practice→Train, or Progress→Rehab?
- B) Journal home → Book, Today, or both?

Tech-debt / later slice: remove the old MobileBottomNav from BreathingExercise.tsx and INCOG.tsx (now superseded by PrimaryNav). Stacked bars on those two routes until then.

Notes / commit checkpoints:
- (record the commit hash or branch before each slice here)