

# Secure the App and Expand the Disclaimer

This plan covers two areas: (1) backend security hardening to protect user data, and (2) expanding the Disclaimer page with comprehensive legal/liability language appropriate for a health-related prototype in beta testing.

---

## Part 1: Backend Security Fixes

### 1A. Enable Leaked Password Protection
The database linter flagged that leaked password protection is disabled. We will enable it so users cannot sign up with passwords found in known data breaches.

### 1B. Fix Public Journal Entry Exposure (Critical)
The security scan found that journal entries marked `is_shared = true` are readable by **anyone, including unauthenticated users**. These entries may contain sensitive health information.

**Fix:** Replace the open "Anyone can read shared journal entries" RLS policy with one that requires authentication:

```sql
DROP POLICY "Anyone can read shared journal entries" ON public.user_journal_entries;

CREATE POLICY "Authenticated users can read shared journal entries"
ON public.user_journal_entries FOR SELECT
TO authenticated
USING (is_shared = true);
```

This ensures only logged-in users can view shared entries, not anonymous scrapers.

### 1C. Add a Prototype/Beta Disclaimer Banner (Global)
Since this is a beta prototype with intentionally public demonstration data, add a persistent disclaimer banner component that appears across the app to limit liability.

---

## Part 2: Expand the Disclaimer Page

The current Disclaimer page (`src/pages/Disclaimer.tsx`) only has an audio player and a one-line intro. We will add comprehensive written disclaimer text covering:

1. **Not Medical Advice** -- This app is a personal memoir and recovery journal, not a substitute for professional medical advice, diagnosis, or treatment.
2. **Beta Prototype Notice** -- This application is a prototype in beta live testing. Features may change, data may be reset, and the experience is provided "as is" without warranty.
3. **No Guarantee of Outcomes** -- Individual recovery experiences vary. Nothing in this app guarantees similar results.
4. **Data Privacy Notice** -- User data (check-ins, journals, assessments) is stored securely but users should not enter information they are not comfortable storing digitally.
5. **Emergency Resources** -- If you are in crisis, contact emergency services (e.g., 988 Suicide & Crisis Lifeline, 000 in Australia).
6. **Intellectual Property** -- All content is copyright Michael Heron. Unauthorized reproduction is prohibited.
7. **Liability Limitation** -- The author and app developers are not liable for any damages arising from use of this application.

The text will appear below the audio player as a scrollable, well-formatted section with clear headings, and users must scroll through it before reaching the "Continue" button.

---

## Part 3: Add Global Beta Disclaimer Component

Create a small, non-intrusive banner component (`BetaDisclaimer`) that shows on key pages (Dashboard, chapters, exercises) with text like:

> "This is a beta prototype for demonstration purposes. Content is not medical advice. See full disclaimer."

With a link to `/disclaimer`.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/Disclaimer.tsx` | Expand with full written disclaimer sections below audio player |
| `src/components/ui/beta-disclaimer-banner.tsx` | New -- small global beta notice banner |
| `src/pages/Dashboard.tsx` | Add BetaDisclaimer banner |
| `src/pages/Index.tsx` | Add BetaDisclaimer banner in footer area |
| Database migration | Drop open journal policy, add authenticated-only policy |
| Auth config | Enable leaked password protection |

---

## Technical Details

**RLS Migration SQL:**
```sql
DROP POLICY IF EXISTS "Anyone can read shared journal entries" 
  ON public.user_journal_entries;

CREATE POLICY "Authenticated users can read shared journal entries"
  ON public.user_journal_entries FOR SELECT
  TO authenticated
  USING (is_shared = true);
```

**BetaDisclaimer component:** A simple fixed-bottom or top banner with orange/amber styling, dismissible per session via localStorage, linking to `/disclaimer`.

**Disclaimer page structure:**
- Audio player (existing, unchanged)
- Section: "Important Notice" (beta prototype statement)
- Section: "Not Medical Advice"
- Section: "No Guarantee of Outcomes"
- Section: "Your Data"
- Section: "Emergency Resources"
- Section: "Limitation of Liability"
- Section: "Copyright"
- "I Understand" / Continue button at bottom

