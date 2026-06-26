-- Narrow self-insert: a user may only insert the 'clinician' role for themselves.
-- Admin and moderator roles can only be granted server-side via service_role.
CREATE POLICY "Users can self-claim clinician role"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'clinician');
