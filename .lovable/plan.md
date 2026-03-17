

# Phoenix AI Companion — Refined Implementation Plan

## What We're Building
A streaming AI chat companion at `/ai-companion` that speaks in Michael's authentic survivor voice, pulls real-time user data, and links back to the app's tools. Accessible from a FAB on PhoenixPath, a button on DailyProtocol completion, and reusable "Ask Phoenix" buttons in modules.

## Refinements from Mike's Plan

The submitted plan is strong. Key refinements:

1. **No CHECK constraint on `role`** — Supabase migrations with CHECK can cause restore issues. Use a validation trigger instead, or simply trust the edge function (only it writes to the table).
2. **No FK to `auth.users`** — per project guidelines, reference user_id as plain uuid with RLS instead.
3. **Reuse existing `phoenix-guide` context-fetch pattern** — the new edge function can share the same data-fetching logic (profiles, checkins, sessions, progress, quests) already proven in `phoenix-guide/index.ts`.
4. **`profiles` table has no `cold_clearance_passed` column** — cold clearance lives in `phoenix_quests.metadata`. The edge function will check `phoenix_quests` where `quest_key = 'cold_resilience'` and `status = 'completed'`.
5. **Torch Check-in** is a separate non-streaming invoke on page load (reuse `phoenix-guide` function directly rather than building a second endpoint).

## Database

**New table: `ai_companion_logs`**
```sql
CREATE TABLE public.ai_companion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  context_snapshot jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ai_companion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON public.ai_companion_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs"
  ON public.ai_companion_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

No changes to existing tables.

## Edge Function: `phoenix-companion`

- **Auth**: `verify_jwt = false` in config.toml, validate via `getClaims()` in code.
- **Context assembly**: Same parallel queries as `phoenix-guide` (profiles, user_progress, daily_checkins last 7, session_logs last 20) plus: last 20 rows from `ai_companion_logs`, cold clearance check from `phoenix_quests`.
- **System prompt**: Michael's exact voice — manuscript anchors (Kmart Ch6, Bailey Ch13, observer practice, sitting with the uncomfortable). 150-word max instruction. Safety-first opener. Cold gate.
- **Streaming**: SSE via Lovable AI gateway (`google/gemini-3-flash-preview`). Return `response.body` directly.
- **Rate limit handling**: Surface 429/402 errors to client.
- **Save messages**: After streaming completes, save user + assistant messages to `ai_companion_logs` via service role client.

## Frontend

### `/ai-companion` page (`src/pages/AICompanion.tsx`)
- Dark theme, 18px base text, 56px tap targets.
- Streaming chat with `react-markdown` rendering.
- "Torch Check-in" card at top: calls existing `phoenix-guide` function on load for a 3-sentence daily summary.
- Input bar at bottom, fixed position.
- Loads conversation history from `ai_companion_logs` on mount.

### `AskAgentButton` (`src/components/ui/ask-agent-button.tsx`)
- Reusable. Accepts `context` string prop.
- Navigates to `/ai-companion?context=...` which pre-fills the first message.
- Placed on: DailyProtocol completion screen, BreathingExercise, MindTraining.

### PhoenixPath changes
- Add second FAB (bottom-left, `MessageCircle` icon, subtle style) linking to `/ai-companion`.
- Small "Torch Check-in" card below FlameStrength showing daily AI summary snippet.

### DailyProtocol changes
- Add `AskAgentButton` in the "complete" step with context "I just finished my daily protocol".

## Routing & Config

**App.tsx**: Add protected route `/ai-companion` -> `AICompanion`.

**config.toml**:
```toml
[functions.phoenix-companion]
verify_jwt = false
```

## Files Summary

| Action | File |
|--------|------|
| Create | `supabase/functions/phoenix-companion/index.ts` |
| Create | `src/pages/AICompanion.tsx` |
| Create | `src/components/ui/ask-agent-button.tsx` |
| Create | Migration for `ai_companion_logs` |
| Modify | `src/App.tsx` — add route |
| Modify | `src/pages/PhoenixPath.tsx` — add companion FAB + torch card |
| Modify | `src/pages/DailyProtocol.tsx` — add AskAgentButton on completion |

