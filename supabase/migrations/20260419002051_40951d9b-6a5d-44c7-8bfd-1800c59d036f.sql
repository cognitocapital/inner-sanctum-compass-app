-- Opt-in for scan persistence
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS personal_scan_optin boolean NOT NULL DEFAULT false;

-- Lightweight region view log (no PHI, region IDs only)
CREATE TABLE IF NOT EXISTS public.brain_region_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  region_id text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brain_region_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own region views"
  ON public.brain_region_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own region views"
  ON public.brain_region_views
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS brain_region_views_user_idx
  ON public.brain_region_views(user_id, viewed_at DESC);