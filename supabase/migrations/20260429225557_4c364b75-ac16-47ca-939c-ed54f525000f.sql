
-- Role enum + user_roles table (foundation for clinician portal in Slice 2)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('patient', 'clinician', 'admin', 'researcher');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Extend clinical_assessments with hospital-grade fields
ALTER TABLE public.clinical_assessments
  ADD COLUMN IF NOT EXISTS instrument_version text,
  ADD COLUMN IF NOT EXISTS responses jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS interpretation text,
  ADD COLUMN IF NOT EXISTS red_flags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mcid_change numeric,
  ADD COLUMN IF NOT EXISTS administered_in text DEFAULT 'self';

CREATE INDEX IF NOT EXISTS idx_clinical_assessments_user_type_date
  ON public.clinical_assessments (user_id, assessment_type, created_at DESC);

-- Red flag events
CREATE TABLE IF NOT EXISTS public.clinical_red_flag_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  flag_type text NOT NULL,
  severity text NOT NULL DEFAULT 'high',
  instrument text,
  source_assessment_id uuid,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinical_red_flag_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own red flags"
  ON public.clinical_red_flag_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own red flags"
  ON public.clinical_red_flag_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own red flags"
  ON public.clinical_red_flag_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own red flags"
  ON public.clinical_red_flag_events FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_red_flags_user_created
  ON public.clinical_red_flag_events (user_id, created_at DESC);

-- Audit log (append-only for compliance)
CREATE TABLE IF NOT EXISTS public.clinical_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinical_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit entries"
  ON public.clinical_audit_log FOR SELECT
  USING (auth.uid() = actor_id);

CREATE POLICY "Users can insert their own audit entries"
  ON public.clinical_audit_log FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

CREATE INDEX IF NOT EXISTS idx_audit_actor_created
  ON public.clinical_audit_log (actor_id, created_at DESC);
