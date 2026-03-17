ALTER TABLE public.daily_checkins ADD COLUMN IF NOT EXISTS last_soundscape text;
ALTER TABLE public.daily_checkins ADD COLUMN IF NOT EXISTS post_session_rating integer;