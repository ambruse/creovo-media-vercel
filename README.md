# Creovo Media

Next.js App Router static website: 22 English routes and 22 Arabic counterparts, nine services, supplied video portfolio, buyer guides and Formspree contact form.

## Local development

```sh
npm ci
npm run dev
npm run build
npm run verify:export
```

`npm run build` creates a static `out/` directory. Vercel detects Next.js and serves this output without server functions.

## Vercel deployment

Use the existing repository/project and Next.js framework preset. Production currently serves `https://www.creovomedia.com`; `siteUrl()` in `lib/site.js` pins that host so preview URLs cannot become canonical. The preferred apex requires reversing the domain-level redirect in Vercel and updating `siteUrl()` together. Read `CREOVO-SEO-P0-CRAWLABILITY.md` first. The old `NEXT_PUBLIC_SITE_URL` variable is no longer used. Optional analytics/search verification settings are in `.env.example`.

The enquiry forms submit to the existing Formspree endpoint. Verify that enquiries arrive from the Vercel domain before switching the public website address.

## Content and localization

Edit `content/ui.mjs`, `content/services.mjs` and `content/insights.mjs`. Both languages share React templates. English lives at `/`; Arabic at `/ar/`. Language switches preserve the equivalent page. `lib/site.js` owns metadata, schema and route inventory.

`content/pages.json` and the old `public/app.js` / `pages.js` are historical and are not loaded by current templates. The shader is extracted from app.js using `node scripts/extract-hero.mjs`; modify the extractor for active hero lifecycle changes. Design styles are in `public/styles.css`, `pages.css` and `localization.css`.

## Portfolio assets

Place source videos in `public/videos/work/`, then run `npm run prepare:media`. This creates a manifest, measured dimensions, muted short previews, posters and optimized brand artwork. Approved editorial metadata belongs in `content/video-details.mjs` so rescanning does not discard it. If replacing an existing source, give it a new stable filename or regenerate its matching poster/preview; existing derivatives are reused. Do not invent publication dates or client attribution.

See `CREOVO-SEO-IMPLEMENTATION.md`, `CREOVO-SEO-KEYWORD-MAP.md`, `SEO-PAGE-MATRIX.md` and `CREOVO-SEO-CONTENT-ROADMAP.md` for implementation, research and remaining account/evidence actions.
