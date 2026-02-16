

# SEO Improvement Plan for Phoenix Journey

## Overview
The site has basic meta tags in index.html but every page shares the same title, description, and social preview. This plan adds per-page SEO, a sitemap, structured data, and canonical URLs to significantly improve search visibility.

---

## 1. Add react-helmet-async for Per-Page Meta Tags

Install `react-helmet-async` and wrap the app with its provider. This lets each page set its own `<title>`, `<meta description>`, and Open Graph tags.

**Changes:**
- **src/App.tsx**: Wrap `AppContent` with `<HelmetProvider>`
- **Create `src/components/seo/SEOHead.tsx`**: A reusable component that accepts `title`, `description`, `path`, and optional `image` props and renders the appropriate `<Helmet>` tags (title, meta description, canonical URL, Open Graph, Twitter Card)

## 2. Add SEOHead to Every Public Page

Each page gets a unique title and description optimized for search:

| Page | Title | Description |
|------|-------|-------------|
| Index | What a Journey - TBI Recovery Story by Michael Heron | An intimate account of recovering from a traumatic brain injury... |
| Dedication | Dedication - What a Journey | The dedication page of What a Journey by Michael Heron |
| Disclaimer | Disclaimer - What a Journey | Important disclaimer for What a Journey |
| Prologue | Prologue - What a Journey | The prologue to What a Journey... |
| Introduction | Introduction - What a Journey | Introduction to What a Journey... |
| Chapter 1 | Chapter 1: Australia Day - What a Journey | The story begins on Australia Day... |
| Chapter 2-21 | Chapter N: [Title] - What a Journey | (unique per chapter) |
| Resources | Growth Resources - What a Journey | Resources for TBI recovery and personal growth |
| Dashboard | Phoenix Journey Dashboard | Your personalized TBI recovery dashboard |

## 3. Generate a Static sitemap.xml

**Create `public/sitemap.xml`** listing all public (non-protected) routes:
- `/`, `/dedication`, `/disclaimer`, `/prologue`, `/introduction`
- `/chapter-1` through `/chapter-21`
- `/resources`, `/install`, `/directory`

Each entry includes `<loc>`, `<lastmod>`, and `<priority>` (homepage = 1.0, chapters = 0.8, others = 0.6).

## 4. Update robots.txt

Add a `Sitemap:` directive pointing to the sitemap:
```
Sitemap: https://whatajourney.lovable.app/sitemap.xml
```

## 5. Add Structured Data (JSON-LD)

**Create `src/components/seo/BookSchema.tsx`**: Renders a `<script type="application/ld+json">` tag with Schema.org `Book` markup including:
- Book name, author (Michael Heron), description
- Number of chapters, genre (autobiography/health)

Add this to the Index page. Optionally add `Article` or `Chapter` schema to individual chapter pages.

## 6. Add Canonical URLs

The `SEOHead` component will automatically output `<link rel="canonical" href="https://whatajourney.lovable.app{path}" />` for each page, preventing duplicate content issues.

---

## Technical Details

### New files:
- `src/components/seo/SEOHead.tsx` — reusable Helmet wrapper
- `src/components/seo/BookSchema.tsx` — JSON-LD structured data
- `public/sitemap.xml` — static sitemap

### Modified files:
- `src/App.tsx` — add HelmetProvider
- `public/robots.txt` — add Sitemap directive
- All public page components (~25 files) — add `<SEOHead>` with unique title/description

### New dependency:
- `react-helmet-async`

### No impact on:
- Existing functionality, audio playback, or styling
- Protected routes (they don't need SEO since they require auth)

