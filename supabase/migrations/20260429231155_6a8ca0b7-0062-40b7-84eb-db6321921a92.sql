-- ============================================================
-- Slice 2: Clinician Portal Foundation
-- ============================================================

-- Organizations (hospitals, clinics, research groups)
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org_type text NOT NULL DEFAULT 'clinic', -- clinic | hospital | research | solo
  contact_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  member_role text NOT NULL DEFAULT 'member', -- admin | member
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Security definer: is the user an admin of the org?
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE user_id = _user_id AND org_id = _org_id AND member_role = 'admin'
  )
$$;

CREATE POLICY "Org members can view their org"
  ON public.organizations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.org_members m WHERE m.org_id = organizations.id AND m.user_id = auth.uid()));

CREATE POLICY "Org admins can update their org"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(auth.uid(), id));

CREATE POLICY "Clinicians can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'clinician') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can view their org membership"
  ON public.org_members FOR SELECT
  USING (user_id = auth.uid() OR public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Org admins manage members"
  ON public.org_members FOR ALL
  USING (public.is_org_admin(auth.uid(), org_id))
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

-- Patient ↔ Clinician link via invite code
CREATE TABLE public.patient_clinician_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  clinician_id uuid,
  org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  invite_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending', -- pending | active | revoked | expired
  consent_scope jsonb NOT NULL DEFAULT '{"assessments":true,"red_flags":true,"checkins":true,"journal":false}'::jsonb,
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days')
);
ALTER TABLE public.patient_clinician_links ENABLE ROW LEVEL SECURITY;
CREATE INDEX patient_clinician_links_patient_idx ON public.patient_clinician_links(patient_id, status);
CREATE INDEX patient_clinician_links_clinician_idx ON public.patient_clinician_links(clinician_id, status);
CREATE INDEX patient_clinician_links_code_idx ON public.patient_clinician_links(invite_code);

-- Security definer: is clinician actively linked to patient?
CREATE OR REPLACE FUNCTION public.is_linked_clinician(_patient_id uuid, _clinician_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.patient_clinician_links
    WHERE patient_id = _patient_id
      AND clinician_id = _clinician_id
      AND status = 'active'
  ) AND public.has_role(_clinician_id, 'clinician')
$$;

CREATE POLICY "Patients view their own links"
  ON public.patient_clinician_links FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Clinicians view links assigned to them"
  ON public.patient_clinician_links FOR SELECT
  USING (auth.uid() = clinician_id AND public.has_role(auth.uid(), 'clinician'));

CREATE POLICY "Patients create their own invite codes"
  ON public.patient_clinician_links FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients revoke their own links"
  ON public.patient_clinician_links FOR UPDATE
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Clinicians accept pending invites"
  ON public.patient_clinician_links FOR UPDATE
  USING (status = 'pending' AND public.has_role(auth.uid(), 'clinician'))
  WITH CHECK (clinician_id = auth.uid() AND public.has_role(auth.uid(), 'clinician'));

-- Clinician alerts (caseload inbox)
CREATE TABLE public.clinician_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  alert_type text NOT NULL, -- red_flag | mcid_decline | missed_checkin | new_assessment
  severity text NOT NULL DEFAULT 'medium', -- low | medium | high | critical
  title text NOT NULL,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_table text,
  source_id uuid,
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clinician_alerts ENABLE ROW LEVEL SECURITY;
CREATE INDEX clinician_alerts_clinician_idx ON public.clinician_alerts(clinician_id, acknowledged_at, created_at DESC);

CREATE POLICY "Clinicians view their own alerts"
  ON public.clinician_alerts FOR SELECT
  USING (auth.uid() = clinician_id AND public.is_linked_clinician(patient_id, auth.uid()));

CREATE POLICY "Clinicians acknowledge their own alerts"
  ON public.clinician_alerts FOR UPDATE
  USING (auth.uid() = clinician_id)
  WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "System inserts alerts for linked clinicians"
  ON public.clinician_alerts FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = clinician_id);

-- ============================================================
-- Extend existing patient-data RLS to allow linked clinician read
-- ============================================================

-- clinical_assessments
CREATE POLICY "Linked clinicians view patient assessments"
  ON public.clinical_assessments FOR SELECT
  USING (public.is_linked_clinician(user_id, auth.uid()));

-- clinical_red_flag_events
CREATE POLICY "Linked clinicians view patient red flags"
  ON public.clinical_red_flag_events FOR SELECT
  USING (public.is_linked_clinician(user_id, auth.uid()));

CREATE POLICY "Linked clinicians acknowledge patient red flags"
  ON public.clinical_red_flag_events FOR UPDATE
  USING (public.is_linked_clinician(user_id, auth.uid()))
  WITH CHECK (public.is_linked_clinician(user_id, auth.uid()));

-- clinical_audit_log
CREATE POLICY "Linked clinicians view patient audit"
  ON public.clinical_audit_log FOR SELECT
  USING (public.is_linked_clinician(actor_id, auth.uid()));

-- daily_checkins
CREATE POLICY "Linked clinicians view patient checkins"
  ON public.daily_checkins FOR SELECT
  USING (public.is_linked_clinician(user_id, auth.uid()));

-- user_journal_entries (only shared)
CREATE POLICY "Linked clinicians view shared journal entries"
  ON public.user_journal_entries FOR SELECT
  USING (is_shared = true AND public.is_linked_clinician(user_id, auth.uid()));

-- profiles (basic identity for linked patients)
CREATE POLICY "Linked clinicians view patient profile"
  ON public.profiles FOR SELECT
  USING (public.is_linked_clinician(id, auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();