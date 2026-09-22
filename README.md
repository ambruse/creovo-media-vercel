# Creovo Media

Next.js App Router project for the Creovo Media website. The current 20 pages are statically generated, including the eight service pages, work, insights, and contact. The design, camera-focused hero, enquiry dialogs, responsive layouts, and Formspree integration are preserved.

## Local development

```sh
npm ci
npm run dev
```

`npm run build` creates a static `out/` directory. Vercel detects Next.js and serves this output without server functions.

## Vercel deployment

Import this GitHub repository in Vercel. Use the repository root as the Root Directory and the Next.js framework preset. Set `NEXT_PUBLIC_SITE_URL` to the final production URL, including `https://` and without a trailing slash. Redeploy after changing this value so canonical links, JSON-LD, robots, and the sitemap point to the correct domain.

The enquiry forms submit to the existing Formspree endpoint. Verify that enquiries arrive from the Vercel domain before switching the public website address.

The existing page content is bundled in `content/pages.json` and rendered by the Next.js route in `app/[[...slug]]/page.jsx`. Styles, interaction scripts, and referenced images are in `public/`. The site contains illustrative campaign concepts and metrics, labeled as such on the pages.
