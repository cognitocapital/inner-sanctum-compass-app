DROP POLICY IF EXISTS "Anyone can read shared journal entries" ON public.user_journal_entries;

CREATE POLICY "Authenticated users can read shared journal entries"
ON public.user_journal_entries FOR SELECT
TO authenticated
USING (is_shared = true);