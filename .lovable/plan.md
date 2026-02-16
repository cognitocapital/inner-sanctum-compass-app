

# Replace Chapter 11 Audio Files

## What's Changing
The current Chapter 11 audio files (`chapter11.mp3`, `chapter11-part2.mp3`, `chapter11-part3.mp3`, `chapter11-part4.mp3`) will be replaced with the 4 new uploaded files, maintaining seamless multi-part playback.

## Steps

1. **Copy new audio files to `public/audio/`**
   - `Chapter_11_The_Inner_Work_1.4.mp3` -> `public/audio/chapter11.mp3`
   - `Chapter_11_The_Inner_Work_2.4.mp3` -> `public/audio/chapter11-part2.mp3`
   - `Chapter_11_The_Inner_Work_3.4.mp3` -> `public/audio/chapter11-part3.mp3`
   - `Chapter_11_The_Inner_Work_4.4.mp3` -> `public/audio/chapter11-part4.mp3`

2. **No code changes needed** -- the player files already reference these exact filenames in the correct order with the transition guard in place.

## Files Modified
- `public/audio/chapter11.mp3` (replaced)
- `public/audio/chapter11-part2.mp3` (replaced)
- `public/audio/chapter11-part3.mp3` (replaced)
- `public/audio/chapter11-part4.mp3` (replaced)

