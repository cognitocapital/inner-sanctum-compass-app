

# Fix Manuscript Content: Word-for-Word Alignment with "What a Journey 6.0"

## The Problem

**Every chapter page (Chapter 1 through Chapter 20 + Acknowledgments) contains AI-generated summaries instead of the actual manuscript text.** The content is fabricated -- it loosely follows the themes but uses entirely different words, misses key details, and distorts the author's voice.

For example:
- **Chapter 1 (current):** "Australia Day 2024. It was the day that my entire life would change forever..." (AI-generated)
- **Chapter 1 (manuscript):** "Australia Day dawned bright and clear; the sun was already warm on my skin. We were at a mate's country property in the Sunshine Coast Hinterland..." (your actual words)

The Dedication, Prologue, and Introduction pages appear correct and match the PDF.

## Where the Change Happened

These chapter files were originally created with placeholder/summarized content -- they were never populated with the actual manuscript text. This is a **content issue from the initial build**, not a regression from the Phoenix Path changes.

The Phoenix Path quest system (`phoenixQuests.ts`) also has fabricated `manuscriptExcerpt` fields (e.g., "What a journey. My life, my world, everything I knew changed in an instant..." -- this text doesn't exist in the book). These need correcting too.

## Affected Files (22 total)

### Chapter Pages (20 files -- full content replacement needed):
| File | Manuscript Source | Status |
|------|-------------------|--------|
| `src/pages/Chapter1.tsx` | Chapter 1: Australia Day (PDF pages 5-5) | Wrong content |
| `src/pages/Chapter2.tsx` | Chapter 2: Hospital Daze (PDF pages 6-7) | Wrong content |
| `src/pages/Chapter3.tsx` | Chapter 3: The Gun to My Head (PDF pages 8-9) | Wrong content |
| `src/pages/Chapter4.tsx` | Chapter 4: Finding My Footing (PDF pages 10-11) | Wrong content |
| `src/pages/Chapter5.tsx` | Chapter 5: Choose Your Own Adventure (PDF page 12) | Wrong content |
| `src/pages/Chapter6.tsx` | Chapter 6: The Roller Coaster (PDF pages 13-14) | Wrong content |
| `src/pages/Chapter7.tsx` | Chapter 7: Mind Games (PDF page 15) | Wrong content |
| `src/pages/Chapter8.tsx` | Chapter 8: Nourishing the Body (PDF page 16) | Wrong content |
| `src/pages/Chapter9.tsx` | Chapter 9: The Business Dilemma (PDF pages 17-18) | Wrong content |
| `src/pages/Chapter10.tsx` | Chapter 10: A New Chapter (PDF pages 19-20) | Wrong content |
| `src/pages/Chapter11.tsx` | Chapter 11: The Inner Work (PDF pages 21-23) | Wrong content |
| `src/pages/Chapter12.tsx` | Chapter 12: Reclaiming Independence (PDF page 24) | Wrong content |
| `src/pages/Chapter13.tsx` | Chapter 13: The Power of Gratitude (PDF page 25) | Wrong content |
| `src/pages/Chapter14.tsx` | Chapter 14: The Universe's Message (PDF pages 26-27) | Wrong content |
| `src/pages/Chapter15.tsx` | Chapter 15: Still Standing (PDF pages 28-29) | Wrong content |
| `src/pages/Chapter16.tsx` | Chapter 16: Looking Forward (PDF pages 30-31) | Wrong content |
| `src/pages/Chapter17.tsx` | Chapter 17: The Torch Rekindled (PDF page 32) | Wrong content |
| `src/pages/Chapter18.tsx` | Chapter 18: Unwritten Chapters (PDF page 33) | Wrong content |
| `src/pages/Chapter19.tsx` | Chapter 19: A New Resource (PDF page 34) | Wrong content |
| `src/pages/Chapter20.tsx` | Chapter 20: The Next Page (PDF page 35) | Wrong content |

### Other files:
| File | Issue |
|------|-------|
| `src/pages/Chapter21.tsx` | Contains fabricated Acknowledgments text -- needs to match PDF pages 36-38 |
| `src/data/phoenixQuests.ts` | `manuscriptExcerpt` and `quote` fields contain fabricated text for all 20 narrative quests |

### Files NOT affected (already correct):
- `src/pages/Dedication.tsx` -- matches PDF
- `src/pages/Prologue.tsx` -- matches PDF
- `src/pages/Introduction.tsx` -- matches PDF

## The Fix

### Step 1: Replace chapter content (Chapters 1-20 + Acknowledgments)
For each chapter file, replace the `<p>` tag content within the `<article>` section with the exact, word-for-word text from the PDF. Preserve:
- The page layout/structure (background, phoenix header, navigation buttons)
- Chapter titles and subtitles (these are already correct)
- Previous/Next chapter navigation links

Only the paragraph content between the subtitle and the navigation buttons changes.

Some chapters are long (e.g., Chapter 11 spans 3 PDF pages with subheadings). These will need multiple paragraphs and may include subheadings (like "Meditation and Mindfulness" and "Practical Tools for You" in Chapter 11).

### Step 2: Fix phoenixQuests.ts excerpts
Update the `manuscriptExcerpt` and `quote` fields in all narrative quest definitions to use actual lines from the corresponding chapters in the PDF.

### Step 3: Verify chapter numbering alignment
The PDF has 20 chapters (1-20) plus Acknowledgments. The codebase has Chapter1-Chapter21, where Chapter21 is Acknowledgments. This mapping is correct and will be preserved.

## How to Prevent This in Future

The root cause is that chapter content was auto-generated instead of being sourced from the manuscript. Going forward:
- All narrative content must come directly from the uploaded manuscript PDF
- Any content changes should be compared against the source document
- The chapter pages should be treated as "read-only content" that mirrors the published book exactly

## Implementation Approach

Due to the volume of content (20 chapters worth of text), this will be done in batches:
1. Chapters 1-5 (Phase 1: The Ashes)
2. Chapters 6-10 (Phase 2: The Forge)
3. Chapters 11-15 (Phase 3: The Ascent)
4. Chapters 16-20 + Acknowledgments (Phase 4: The Soar)
5. phoenixQuests.ts excerpt corrections

Each batch will copy the exact text from the PDF into the corresponding TSX files, paragraph by paragraph, preserving the existing page structure and styling.

