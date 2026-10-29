# Creovo Media

Next.js App Router static website: 44 English routes and 44 Arabic counterparts, including 21 individual film pages, nine services, buyer guides and the Formspree contact form. The two case-study holding pages remain noindex.

## Local development

```sh
npm ci
npm run dev
npm run build
npm run verify:export
node --test scripts/test-language-switch.mjs
```

`npm run build` creates a static `out/` directory. Vercel detects Next.js and serves this output without server functions.

## Vercel deployment

Use the existing repository/project and Next.js framework preset. Production uses `https://creovomedia.com`; www permanently redirects to the apex. `siteUrl()` in `lib/site.js` pins that host so preview URLs cannot become canonical. Preserve the domain redirects and canonical host together. The old `NEXT_PUBLIC_SITE_URL` variable is no longer used. Optional analytics/search verification settings are in `.env.example`.

The enquiry forms submit to the existing Formspree endpoint. Verify that enquiries arrive from the Vercel domain before switching the public website address.

## Content and localization

Edit `content/ui.mjs`, `content/services.mjs` and `content/insights.mjs`. Both languages share React templates. English lives at `/`; Arabic at `/ar/`. Language switches preserve the equivalent page and allowlisted contact service choices, including changes made in the dropdown. Other query parameters and personal form values are not carried into the language link. `lib/site.js` owns metadata, schema and route inventory.

`content/pages.json` and the old `public/app.js` / `pages.js` are historical and are not loaded by current templates. The shader is extracted from app.js using `node scripts/extract-hero.mjs`; modify the extractor for active hero lifecycle changes. Design styles are in `public/styles.css`, `pages.css` and `localization.css`.

The two guide resources in `components/GuideResource.jsx` provide a copyable bilingual brief and clearly labeled fictional planning examples. Do not relabel these examples as client work.

## Portfolio assets

Place source videos in `public/videos/work/`, then run `npm run prepare:media`. This creates a manifest, measured dimensions, muted short previews, posters and optimized brand artwork. Approved editorial metadata belongs in `content/video-details.mjs` so rescanning does not discard it. If replacing an existing source, give it a new stable filename or regenerate its matching poster/preview; existing derivatives are reused. Do not invent publication dates or client attribution.

Each manifest ID produces `/work/<id>/` and `/ar/work/<id>/`, with canonicals, language alternates, breadcrumbs and sitemap entries. Preserve IDs when updating assets to keep these URLs stable. The portfolio includes a complete server-rendered link index; the preview gallery uses manifest order before and after hydration. Film pages use existing titles and measured media facts, not unverified case-study claims. Add approved bilingual descriptions in `content/video-details.mjs` to enrich them. VideoObject markup still requires verified publication dates before it can be added.

Video quality: the active `hq-v2` profile preserves source resolution, encodes 10-second H.264 previews at CRF 18, and generates full-resolution JPEG posters. It replaces the former 640-pixel CRF 29 previews. Full playback uses the untouched original. Only visible videos load/play (one mobile, two desktop); improved quality increases transfer size. Low-resolution source footage needs a higher-resolution master to gain actual detail.

See `CREOVO-SEO-IMPLEMENTATION.md`, `CREOVO-SEO-KEYWORD-MAP.md`, `SEO-PAGE-MATRIX.md` and `CREOVO-SEO-CONTENT-ROADMAP.md` for implementation, research and remaining account/evidence actions.
