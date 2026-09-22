import pages from '../content/pages.json';

export const originalSiteUrl = 'https://creovo-media.muhammed01jabir.chatgpt.site';

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (!configured) return originalSiteUrl;
  const url = configured.startsWith('http') ? configured : `https://${configured}`;
  return url.replace(/\/$/, '');
}

export function allRoutes() {
  return Object.keys(pages);
}

export function pageForRoute(route) {
  return pages[route];
}

export function routeForSlug(slug) {
  return slug?.length ? `/${slug.join('/')}/` : '/';
}

export function structuredDataFor(page) {
  const base = siteUrl();
  return page.structuredData.map((entry) =>
    JSON.parse(JSON.stringify(entry).replaceAll(originalSiteUrl, base))
  );
}
