CREATE TABLE public.ai_companion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  context_snapshot jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ai_companion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companion logs"
  ON public.ai_companion_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companion logs"
  ON public.ai_companion_logs FOR INSERT WITH CHECK (auth.uid() = user_id);