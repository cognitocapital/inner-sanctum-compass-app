

# Replace Audio Files for Introduction and Chapter 11

## The Problem

The code is correct — it already references all the right files. But the actual audio files sitting in `public/audio/` are outdated. Your newly uploaded files need to replace them.

## What Will Change

### Step 1: Replace Introduction Part 4
Copy your uploaded `introduction_continued...mp3` to `public/audio/introduction-part4.mp3`, replacing the current file. This is the additional content that completes the Introduction to match the manuscript.

### Step 2: Replace All 4 Chapter 11 Audio Files
Copy your uploaded Chapter 11 files to replace the existing ones:
- `Chapter_11_The_Inner_Work_1.4-2.mp3` replaces `public/audio/chapter11.mp3`
- `Chapter_11_The_Inner_Work_2.4-2.mp3` replaces `public/audio/chapter11-part2.mp3`
- `Chapter_11_The_Inner_Work_3.4-2.mp3` replaces `public/audio/chapter11-part3.mp3`
- `Chapter_11_The_Inner_Work_4.4-2.mp3` replaces `public/audio/chapter11-part4.mp3`

### Step 3: No Code Changes Needed
Both `global-audiobook-player.tsx` and `uploaded-audiobook-player.tsx` already reference:
- Introduction: parts 1-4
- Chapter 11: parts 1-4

The player logic, seamless transitions, and `NetworkFirst` caching strategy are all already in place.

## Why This Will Work After Publishing

- The `NetworkFirst` caching fix from earlier means browsers will fetch the new files from the server on first visit
- No code changes means no risk of introducing new bugs
- The files simply get swapped — same filenames, updated content

## Files Modified
- `public/audio/introduction-part4.mp3` (replaced)
- `public/audio/chapter11.mp3` (replaced)
- `public/audio/chapter11-part2.mp3` (replaced)
- `public/audio/chapter11-part3.mp3` (replaced)
- `public/audio/chapter11-part4.mp3` (replaced)
