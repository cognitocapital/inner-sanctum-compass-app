

# Two Audio Tweaks

## Task 1: Add Third Audio Part to Introduction

The uploaded MP3 file is a continuation of the Introduction audio. Currently the Introduction has 2 audio parts (`introduction.mp3` and `introduction-part2.mp3`). This new file will be added as a third part for seamless playback.

**Steps:**
1. Copy the uploaded file to `public/audio/introduction-part3.mp3`
2. Update the Introduction audio entry in **both** player files to include the third part:
   - `src/components/ui/global-audiobook-player.tsx` (line 28): change the array to `["/audio/introduction.mp3", "/audio/introduction-part2.mp3", "/audio/introduction-part3.mp3"]`
   - `src/components/ui/uploaded-audiobook-player.tsx` (line 26): same change

No changes needed to `Introduction.tsx` itself -- the audio is handled by the players.

---

## Task 2: Fix Chapter 11 Audio Loop Bug

**Root cause:** When a multi-part chapter finishes its last segment, `handleEnded` calls `setCurrentAudioIndex(0)` before the 4-second `setTimeout` fires. This triggers the `useEffect` watching `[currentChapterIndex, currentAudioIndex]`, which sees the audio index changed while the chapter index is still on Chapter 11 -- so it reloads and plays Chapter 11 part 1 again (the loop).

**Fix:** Add a `useRef` transition guard to both player files.

**Changes to `global-audiobook-player.tsx`:**
1. Add ref: `const isTransitioningRef = useRef(false);`
2. In `handleEnded` else branch (line 184-194): set `isTransitioningRef.current = true` before `setCurrentAudioIndex(0)`, then clear it inside the `setTimeout` callback before changing chapter
3. In the useEffect at line 104-117: add early return `if (isTransitioningRef.current) return;`

**Changes to `uploaded-audiobook-player.tsx`:**
1. Same ref addition
2. In `handleEnded` else branch (line 168-180): same guard pattern
3. In the useEffect at line 94-112: same early return

This prevents the useEffect from reloading part 1 during the transition window, allowing the 4-second pause to complete and the chapter to advance properly.

---

## Files Modified
- `public/audio/introduction-part3.mp3` -- new file (copied from upload)
- `src/components/ui/global-audiobook-player.tsx` -- add intro part 3 to chapter list + transition guard
- `src/components/ui/uploaded-audiobook-player.tsx` -- add intro part 3 to chapter list + transition guard

