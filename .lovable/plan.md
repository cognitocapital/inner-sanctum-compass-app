
# Fix: Audio Duplication in Playback

## Root Cause

The `<audio>` HTML element in `global-audiobook-player.tsx` has its `src` attribute set in **two places simultaneously**:

1. **React JSX prop** (line 242): `src={currentAudioUrl || undefined}` -- React updates this on every re-render
2. **useEffect** (line 122): `audio.src = audioUrl; audio.load()` -- runs when chapter/segment index changes

When a segment transition happens (e.g., Introduction part 3 ends and part 4 should play):
- React re-renders and sets the new `src` on the DOM element, which starts loading
- The useEffect then fires, sets `src` again, and calls `load()`, starting a second load
- Both trigger `canplaythrough`, both call `play()` -- you hear the audio twice or get garbled playback

## Changes

### File 1: `src/components/ui/global-audiobook-player.tsx`

**Remove `src` from the `<audio>` JSX element.** The useEffect is the sole controller of audio source loading. This eliminates the double-load that causes duplication.

Before:
```tsx
<audio
  ref={audioRef}
  src={currentAudioUrl || undefined}
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  onEnded={handleEnded}
  preload="auto"
/>
```

After:
```tsx
<audio
  ref={audioRef}
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  onEnded={handleEnded}
  preload="auto"
/>
```

### File 2: `src/components/ui/uploaded-audiobook-player.tsx`

Apply the same fix -- remove `src` from the `<audio>` JSX and let the useEffect handle it exclusively. Also apply the same `canplaythrough` buffering pattern used in the global player to prevent race conditions.

### File 3: Copy the uploaded introduction audio

Replace `public/audio/introduction-part4.mp3` with the latest uploaded file to ensure the content matches the manuscript.

## Why This Fixes It

- Single source of truth: only the useEffect sets `audio.src` and calls `load()`
- No more double-load causing duplicate playback
- The `canplaythrough` listener ensures `play()` only fires once per load
- Works identically on web and mobile since both use the same HTML5 Audio API

## Files Modified
- `src/components/ui/global-audiobook-player.tsx` (remove src prop from audio element)
- `src/components/ui/uploaded-audiobook-player.tsx` (same fix plus canplaythrough pattern)
- `public/audio/introduction-part4.mp3` (replaced with latest upload)
