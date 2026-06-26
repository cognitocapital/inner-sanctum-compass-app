-- Lock down audit-log writes to server-side code only
DROP POLICY IF EXISTS "Users can insert their own audit entries" ON public.clinical_audit_log;
-- (no INSERT policy = blocked for authenticated; service_role bypasses RLS)

-- Prevent admins from granting/revoking roles directly; force role grants through server-side code
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
-- INSERT intentionally omitted: only service_role (edge functions) can mint roles.

-- Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public roles.
-- These run as table triggers; clients should never call them directly.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Note: has_role, is_linked_clinician, is_org_admin are intentionally executable by
-- authenticated users because RLS policies invoke them via auth.uid(). Leave as-is.
