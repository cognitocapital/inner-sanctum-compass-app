-- 1. Remove the broad shared-journal SELECT policy (any authed user could read all shared entries).
-- Sharing will be reintroduced via an explicit recipient/care-circle model.
DROP POLICY IF EXISTS "Authenticated users can read shared journal entries" ON public.user_journal_entries;

-- 2. Revoke public EXECUTE on SECURITY DEFINER trigger functions.
-- These are only meant to be called by triggers, not via the API.
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 3. Add DELETE policies (right-to-erasure / GDPR) on user-owned tables that lacked them.
CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.session_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins"
  ON public.daily_checkins FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
  ON public.ai_recommendations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own week progress"
  ON public.week_progress FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own region views"
  ON public.brain_region_views FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companion logs"
  ON public.ai_companion_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE USING (auth.uid() = id);
