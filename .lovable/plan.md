

# Fix: Published Audio Not Updating (Service Worker Cache Issue)

## Problem
The PWA service worker uses a `CacheFirst` strategy for audio files. This means browsers that previously visited the site have the **old** audio files permanently cached. When you replace files like `chapter11.mp3`, the service worker serves the stale cached version instead of downloading the new one.

## Solution

Change the audio caching strategy from `CacheFirst` to `StaleWhileRevalidate`. This serves the cached version immediately (fast playback) but also fetches the updated file in the background so the **next** visit uses the new audio.

Additionally, bump the cache name to force invalidation of the old cache on existing users' devices.

## Changes

### File: `vite.config.ts`

1. Change the `/audio/` runtime caching rule (lines 78-88):
   - Strategy: `CacheFirst` to `StaleWhileRevalidate`
   - Cache name: `local-audio-cache` to `local-audio-cache-v2` (forces old cache eviction)
   - Keep the 60-day expiration

2. Change the external audio rule (lines 63-77):
   - Strategy: `CacheFirst` to `StaleWhileRevalidate`  
   - Cache name: `audio-video-cache` to `audio-video-cache-v2`

Video and font caches can stay `CacheFirst` since those files don't change.

## What This Means for Users
- **First visit after publish**: Users hear the old cached audio, but the new files download silently in the background
- **Second visit onward**: Users hear the updated audio
- Users who have never visited before get the new audio immediately
- No impact on playback speed, transitions, or any other functionality

## Technical Detail
Only two lines change in `vite.config.ts` (the `handler` values) plus two cache name bumps. No other files are modified.

