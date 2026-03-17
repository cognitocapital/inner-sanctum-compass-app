

# Fix Google Search Indexing: Homepage vs Disclaimer

## Problem

There are two issues causing Google to prefer the disclaimer page over the homepage:

1. **Wrong domain in all SEO assets**: The sitemap, robots.txt, canonical URLs, OG tags, and BookSchema all reference `whatajourney.lovable.app` instead of your custom domain `whatajourney.app`. Google sees these as two different sites and may index whichever it crawled first or found more links to.

2. **`index.html` meta tags reference "Phoenix Journey"**: The static HTML `<title>` and `<meta name="description">` say "Phoenix Journey - TBI Recovery" — not "What a Journey". Since SPA crawlers sometimes only see the static HTML (before React renders), Google may be using the less descriptive static metadata and picking a different page that has clearer content.

## Fix

### 1. Update `SITE_URL` to custom domain
In `src/components/seo/SEOHead.tsx`, change:
```
const SITE_URL = "https://whatajourney.app";
```

### 2. Update `index.html` static meta tags
Change the `<title>` and `<meta description>` to match the homepage SEO:
- Title: `What a Journey - TBI Recovery Story by Michael Heron`
- Description: `An intimate account of recovering from a traumatic brain injury...`
- Update OG/Twitter tags similarly

### 3. Update `sitemap.xml` URLs
Replace all `whatajourney.lovable.app` with `whatajourney.app`.

### 4. Update `robots.txt` sitemap reference
Point to `https://whatajourney.app/sitemap.xml`.

### 5. Update `BookSchema.tsx` URL
Change the `url` field to `https://whatajourney.app`.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/seo/SEOHead.tsx` | Update `SITE_URL` |
| `src/components/seo/BookSchema.tsx` | Update `url` field |
| `index.html` | Update title, description, OG/Twitter tags |
| `public/sitemap.xml` | Replace all URLs to custom domain |
| `public/robots.txt` | Update sitemap URL |

## Important Note

After publishing, you should submit your updated sitemap to Google Search Console for `whatajourney.app` to speed up re-indexing. Google re-crawling can take days to weeks otherwise.

