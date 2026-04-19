CREATE TABLE IF NOT EXISTS public.user_affected_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  region_id text NOT NULL,
  severity text,
  source text DEFAULT 'self-reported',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, region_id)
);

ALTER TABLE public.user_affected_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own affected regions"
  ON public.user_affected_regions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affected regions"
  ON public.user_affected_regions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affected regions"
  ON public.user_affected_regions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own affected regions"
  ON public.user_affected_regions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_affected_regions_user_idx
  ON public.user_affected_regions(user_id);

CREATE TRIGGER update_user_affected_regions_updated_at
  BEFORE UPDATE ON public.user_affected_regions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();