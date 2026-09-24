import { allRoutes, siteUrl, languages, pageForRoute } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  return allRoutes().filter(route=>!pageForRoute(route).noindex).flatMap(route=>['en','ar'].map(locale=>({
    url:`${siteUrl()}${locale==='ar'?'/ar':''}${route}`,
    alternates:{languages:languages(route)},
  })));
}
