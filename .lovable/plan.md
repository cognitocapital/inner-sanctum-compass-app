

# Fix: Audio Playing Twice Due to Stale Event Listeners

## Root Cause

The `canplaythrough` event listener cleanup is broken in both player files. Here's why:

In the useEffect (e.g., line 106-128 of `global-audiobook-player.tsx`):

```tsx
const onReady = () => { /* play audio */ };
audio.removeEventListener('canplaythrough', onReady);  // This does NOTHING
audio.src = audioUrl;
audio.load();
audio.addEventListener('canplaythrough', onReady, { once: true });
```

The `removeEventListener` call on the previous listener **never works** because `onReady` is a brand-new function created each time the useEffect runs. JavaScript's `removeEventListener` requires the **exact same function reference** to remove a listener. Since each useEffect invocation creates a new `onReady`, the old listener is never removed.

When the useEffect fires rapidly (e.g., during segment transitions where both `currentAudioIndex` and `currentChapterIndex` change), multiple `canplaythrough` listeners stack up on the same `<audio>` element. Each one calls `play()`, causing the audio to appear to play twice or produce garbled/overlapping sound.

## The Fix

Use an `AbortController` to properly cancel previous listeners before adding new ones. This is the modern, reliable way to clean up event listeners regardless of function reference identity.

### File 1: `src/components/ui/global-audiobook-player.tsx`

Replace the useEffect (lines 105-128) with:

```tsx
const abortControllerRef = useRef<AbortController | null>(null);

useEffect(() => {
  if (isTransitioningRef.current) return;
  const audioUrl = getCurrentAudioUrl();
  if (audioRef.current && audioUrl) {
    const audio = audioRef.current;

    // Abort any previous canplaythrough listener
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Stop any current playback before switching
    audio.pause();
    audio.src = audioUrl;
    audio.load();
    setCurrentTime(0);

    audio.addEventListener('canplaythrough', () => {
      audio.playbackRate = 0.93;
      if (playIntentRef.current) {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    }, { once: true, signal: controller.signal });
  }
}, [currentChapterIndex, currentAudioIndex]);
```

### File 2: `src/components/ui/uploaded-audiobook-player.tsx`

Apply the identical `AbortController` pattern to its useEffect (lines 96-123).

### File 3: Replace audio file

Copy the uploaded `introduction_continued...mp3` to `public/audio/introduction-part4.mp3` to ensure it matches the latest manuscript content.

## Why This Works

- `AbortController.abort()` instantly cancels the previous listener, guaranteed -- no function reference matching needed
- `audio.pause()` before setting new `src` prevents any overlap from a still-playing previous segment
- Single `canplaythrough` listener at any time means `play()` is only ever called once per load
- Works identically on web and mobile (standard Web API)

## Files Modified
- `src/components/ui/global-audiobook-player.tsx` (AbortController pattern for canplaythrough)
- `src/components/ui/uploaded-audiobook-player.tsx` (same fix)
- `public/audio/introduction-part4.mp3` (replaced with latest upload)
