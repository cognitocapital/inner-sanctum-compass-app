
DROP POLICY IF EXISTS "Linked clinicians view patient audit" ON public.clinical_audit_log;
CREATE POLICY "Linked clinicians view patient audit"
ON public.clinical_audit_log
FOR SELECT
TO authenticated
USING (
  target_type = 'patient'
  AND target_id IS NOT NULL
  AND public.is_linked_clinician(target_id, auth.uid())
);

DROP POLICY IF EXISTS "System inserts alerts for linked clinicians" ON public.clinician_alerts;
CREATE POLICY "Clinicians insert alerts for linked patients"
ON public.clinician_alerts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = clinician_id
  AND public.has_role(auth.uid(), 'clinician')
  AND public.is_linked_clinician(patient_id, auth.uid())
);

DROP POLICY IF EXISTS "Clinicians accept pending invites" ON public.patient_clinician_links;
CREATE POLICY "Clinicians accept pending invites"
ON public.patient_clinician_links
FOR UPDATE
TO authenticated
USING (
  status = 'pending'
  AND public.has_role(auth.uid(), 'clinician')
  AND (clinician_id IS NULL OR clinician_id = auth.uid())
)
WITH CHECK (
  clinician_id = auth.uid()
  AND public.has_role(auth.uid(), 'clinician')
);
