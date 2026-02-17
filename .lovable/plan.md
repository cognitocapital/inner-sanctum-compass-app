

# Fix: Audio Not Updating on Published Site + Playback Race Condition

## Root Cause

Two separate issues are preventing the published site from playing updated audio correctly.

### Issue 1: Precache Overrides NetworkFirst

In `vite.config.ts`, the line:
```
includeAssets: ['favicon.ico', 'audio/**/*', 'video/**/*', 'lovable-uploads/**/*']
```
...tells the service worker to **precache** every audio file during installation. Precached files are served directly from the precache manifest and **completely bypass** runtime caching rules like `NetworkFirst`. This means:
- The `NetworkFirst` handler you set up never runs for audio
- Old visitors' browsers serve the stale precached audio forever
- New audio files only appear if the entire service worker is reinstalled

### Issue 2: Player Race Condition (AbortError Spam)

The player calls `play()` right after `load()` without waiting for the browser to finish loading the new audio source. Additionally, when a chapter ends, the 4-second timeout calls `play()` which races with the useEffect that also loads + plays the next source. This causes the cascade of `AbortError: The play() request was interrupted by a new load request` errors visible in the console.

---

## Changes

### File 1: `vite.config.ts`

**Remove `'audio/**/*'`** from the `includeAssets` array (line 18). Audio will now be handled exclusively by the `NetworkFirst` runtime caching rule, which fetches fresh files from the server on every visit and only falls back to cache when offline.

Before:
```
includeAssets: ['favicon.ico', 'audio/**/*', 'video/**/*', 'lovable-uploads/**/*']
```

After:
```
includeAssets: ['favicon.ico', 'video/**/*', 'lovable-uploads/**/*']
```

### File 2: `src/components/ui/global-audiobook-player.tsx`

**Fix the race condition** in the chapter/segment transition logic:

1. In the `useEffect` that handles chapter and audio segment changes (lines 105-119): instead of calling `play()` immediately after `load()`, attach a one-time `canplaythrough` event listener so play only fires once the browser has enough data buffered.

2. In the `handleEnded` function (lines 178-198): remove the direct `play()` call from the timeout. The useEffect already handles playback when `currentChapterIndex` changes, so the timeout only needs to update the chapter index -- the useEffect will take care of starting playback once the audio is ready.

3. Track `isPlaying` intent with a ref so the useEffect knows whether to auto-play after loading (the current code uses `isPlaying` state which is stale inside the effect).

---

## What This Means

- **First visit after publish**: Updated audio plays immediately -- no second visit needed
- **Offline users**: Audio still works from cache as a fallback
- **No more AbortError spam**: Playback only starts when the browser confirms the audio source is ready
- **Seamless multi-part chapters**: Chapter 11 (and all other multi-part chapters) transition smoothly between segments
- **Playback speed**: 0.93x is preserved (set in `canplaythrough` handler)

## Files Modified
- `vite.config.ts` (1 line change)
- `src/components/ui/global-audiobook-player.tsx` (transition logic rewrite)

