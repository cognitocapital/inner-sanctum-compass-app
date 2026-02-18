
# Fix: "Start Listening" Button Doesn't Play on First Visit

## Root Cause (Confirmed)

The problem is in `src/components/ui/global-audiobook-player.tsx` line 242:

```tsx
if (!isVisible) return null;
```

This means the `GlobalAudiobookPlayer` is **completely unmounted** when not visible. Every time the user clicks "Start Listening", the component **mounts fresh** with all refs reset to their defaults — including `playIntentRef.current = false`.

The `useEffect` that loads audio fires on mount and attaches a `canplaythrough` listener. That listener checks `playIntentRef.current` — but it's `false` because the component just mounted. So even though the audio is ready to play, nothing happens. The user must click the play button manually.

## The Fix

Two small, targeted changes:

### 1. Add `autoPlay` prop to `GlobalAudiobookPlayer`

Pass an `autoPlay` boolean from `App.tsx`. When `true`, set `playIntentRef.current = true` inside the loading `useEffect` before the `canplaythrough` listener fires.

```tsx
// In global-audiobook-player.tsx useEffect:
if (autoPlay) {
  playIntentRef.current = true;
}
```

### 2. Set `autoPlay = true` when opened via `openAudiobook()`

In `App.tsx`, track a separate `autoPlayOnOpen` state. When `window.openAudiobook()` is called (from the "Start Listening" button), set it `true`. Pass it as the `autoPlay` prop. Reset it to `false` once the player has mounted and consumed it.

```tsx
// App.tsx
const [autoPlayOnOpen, setAutoPlayOnOpen] = useState(false);

window.openAudiobook = (chapterId?: string) => {
  if (chapterId) setStartChapterId(chapterId);
  setAutoPlayOnOpen(true);  // Signal intent to auto-play
  setAudiobookVisible(true);
};

<GlobalAudiobookPlayer
  isVisible={audiobookVisible}
  onClose={() => setAudiobookVisible(false)}
  startChapterId={startChapterId}
  autoPlay={autoPlayOnOpen}
/>
```

### 3. Consume `autoPlay` inside the player's mount effect

In `global-audiobook-player.tsx`, the loading `useEffect` already runs on mount. Add one line to set `playIntentRef.current = true` when `autoPlay` is truthy:

```tsx
useEffect(() => {
  if (isTransitioningRef.current) return;
  const audioUrl = getCurrentAudioUrl();
  if (!audioRef.current || !audioUrl) return;
  const audio = audioRef.current;

  if (abortControllerRef.current) abortControllerRef.current.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  // ✅ THE FIX: if opened with autoPlay intent, set the flag before canplaythrough fires
  if (autoPlay) {
    playIntentRef.current = true;
  }

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

  return () => { controller.abort(); };
}, [currentChapterIndex, currentAudioIndex]);
```

## Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Add `autoPlayOnOpen` state, set it `true` in `openAudiobook()`, pass as `autoPlay` prop |
| `src/components/ui/global-audiobook-player.tsx` | Accept `autoPlay` prop, set `playIntentRef.current = true` in load effect when `autoPlay` is truthy |

## Why This Is Safe

- No change to audio loading sequence or AbortController logic
- `autoPlay` only affects the very first load after the component mounts
- Subsequent play/pause clicks continue to use `handlePlayPause` as before
- The fix works identically on mobile and web — both respect user gesture since the gesture (button click) is what calls `openAudiobook()` in the first place
