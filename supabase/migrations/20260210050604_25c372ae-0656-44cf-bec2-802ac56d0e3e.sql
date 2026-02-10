
-- =============================================
-- THE PHOENIX PATH: Database Schema
-- =============================================

-- 1. Phoenix Quests (user quest progress tracking)
CREATE TABLE public.phoenix_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quest_key TEXT NOT NULL,
  quest_type TEXT NOT NULL, -- narrative, breathing, cold, cognitive, mindfulness, reflection, toolkit, echo
  phase INTEGER NOT NULL DEFAULT 1, -- 1=Ashes, 2=Forge, 3=Ascent, 4=Soar
  status TEXT NOT NULL DEFAULT 'available', -- locked, available, in_progress, completed
  xp_reward INTEGER NOT NULL DEFAULT 50,
  completed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  book_chapter_ref INTEGER,
  symptom_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_key)
);

ALTER TABLE public.phoenix_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests"
  ON public.phoenix_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
  ON public.phoenix_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
  ON public.phoenix_quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quests"
  ON public.phoenix_quests FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_phoenix_quests_updated_at
  BEFORE UPDATE ON public.phoenix_quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. User Journal Entries (My Phoenix Chapters)
CREATE TABLE public.user_journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phase INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  mood_tag TEXT,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journal entries"
  ON public.user_journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.user_journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.user_journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.user_journal_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read shared journal entries"
  ON public.user_journal_entries FOR SELECT
  USING (is_shared = true);

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.user_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Resource Directory (public read)
CREATE TABLE public.resource_directory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- telehealth, support_group, financial, app, organization, toolkit
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT 'global', -- australia, international, global
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resources"
  ON public.resource_directory FOR SELECT
  USING (true);

-- 4. Update profiles with Phoenix Path columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phoenix_phase INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS flame_strength INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominant_symptoms TEXT[] NOT NULL DEFAULT '{}';
