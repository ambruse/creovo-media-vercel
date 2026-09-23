import Script from 'next/script';
import { notFound } from 'next/navigation';
import { allRoutes, pageForRoute, routeForSlug, siteUrl, structuredDataFor } from '../../lib/site';
import WorkMedia from '../../components/WorkMedia';

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((route) => ({
    slug: route === '/' ? undefined : route.split('/').filter(Boolean),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const route = routeForSlug(slug);
  const page = pageForRoute(route);
  if (!page) return {};
  const canonical = `${siteUrl()}${route}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: page.openGraphTitle || page.title,
      description: page.openGraphDescription || page.description,
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title: page.title,
      description: page.description,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const route = routeForSlug(slug);
  const page = pageForRoute(route);
  if (!page) notFound();

  return (
    <>
      {structuredDataFor(page).map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replaceAll('<', '\\u003c') }}
        />
      ))}
      <div className={page.bodyClass || undefined} dangerouslySetInnerHTML={{ __html: page.body }} />
      <WorkMedia route={route} />
      <Script src={route === '/' ? '/app.js' : '/pages.js'} strategy="afterInteractive" />
    </>
  );
}
