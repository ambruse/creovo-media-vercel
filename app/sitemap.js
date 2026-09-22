import { allRoutes, siteUrl } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  return allRoutes().map((route) => ({
    url: `${siteUrl()}${route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
