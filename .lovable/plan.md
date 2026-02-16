

# Fix Chapter 11 Audio Loop Bug

## Problem
When the last part of a multi-part chapter finishes (e.g., Chapter 11 part 4), `handleEnded` calls `setCurrentAudioIndex(0)` before the 4-second timeout fires. This triggers the `useEffect` watching `[currentChapterIndex, currentAudioIndex]`, which sees the audio index changed while the chapter index is still Chapter 11 -- so it reloads and plays Chapter 11 part 1 again.

## Fix
Add a `useRef` transition guard (`isTransitioningRef`) to prevent the useEffect from reloading audio during the reset-before-next-chapter phase.

### Changes to both files:

**`src/components/ui/global-audiobook-player.tsx`** and **`src/components/ui/uploaded-audiobook-player.tsx`**

1. Add a ref: `const isTransitioningRef = useRef(false);`

2. In `handleEnded` else branch (chapter complete):
   - Set `isTransitioningRef.current = true` BEFORE `setCurrentAudioIndex(0)`
   - In the setTimeout callback, set `isTransitioningRef.current = false` BEFORE changing chapter

3. In the useEffect watching `[currentChapterIndex, currentAudioIndex]`:
   - Add early return: `if (isTransitioningRef.current) return;`

This way, when a multi-part chapter ends:
- The flag is set, preventing the useEffect from reloading part 1
- After 4 seconds, the flag clears and the chapter index changes, triggering normal playback of the next chapter

No other audio changes needed -- playback is confirmed working correctly otherwise.
