REVOKE EXECUTE ON FUNCTION public.is_org_admin(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_linked_clinician(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_admin(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_linked_clinician(uuid, uuid) TO authenticated;