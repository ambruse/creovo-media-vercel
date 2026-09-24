# Production crawlability — 24 September 2026

## Observed baseline

Evidence: `docs/seo/production-audit.json`. Reproduce with `npm run audit:production`. These are point-in-time HTTP requests, not an uptime history or authenticated Googlebot test.

| Request | Observed response |
|---|---|
| HTTPS apex, ordinary / Googlebot / bingbot user agents | 308 → www homepage 200 |
| HTTPS www, same three user agents | 200 |
| HTTP apex | 308 → HTTPS apex → 308 → HTTPS www → 200 |
| HTTP www | 308 → HTTPS www → 200 |
| www robots.txt and sitemap.xml | 200 |
| www branding, video production, work and contact | 200 |
| www /ar/ | 404 before this implementation |
| Deliberately nonexistent URL | 404 |

No 503 was reproduced in this sample. That does not prove intermittent failures are resolved. There was no observed crawler-specific block for the tested user-agent strings. Real Googlebot IP validation, server logs, Search Console Crawl Stats, URL Inspection and Vercel firewall history were not accessible. No evidence supports blaming DNS, a WAF, rate limiting or an origin timeout.

## Canonical host requires a coordinated deployment change

The brief requests `https://creovomedia.com`, but production currently serves `https://www.creovomedia.com` and redirects the apex to it. This implementation deliberately uses the observed serving host for canonical, hreflang, schema and sitemap. Setting an apex canonical now would point every canonical at a redirect.

To adopt the owner's preferred apex host:

1. In the existing Vercel project, verify both domains and DNS, then make the apex the serving production domain.
2. Reverse the existing apex → www redirect. Configure www → apex permanently, preserving path and query. Check for a redirect loop before saving the final configuration.
3. Change `siteUrl()` in `lib/site.js` to the apex in the same release and rebuild. Do not add a competing host redirect to this repository while the existing domain-level redirect remains.
4. Test all four HTTP/HTTPS and www/apex variants, including nested Arabic pages. Prefer one hop to the final HTTPS canonical where Vercel permits it.
5. Submit the final sitemap in the verified Search Console and Bing properties. Inspect a home, service, Arabic service and work URL.

Vercel project/domain credentials were unavailable. No DNS, firewall or domain settings were changed. This host decision is a remaining P0 release item, not a completed fix.

## Repository fixes and release checks

- English and Arabic content is statically rendered; no translation overlay or client-only replacement is required for search engines.
- Canonicals never derive from preview hosts. Preview builds set page-level noindex through `VERCEL_ENV=preview`.
- Sitemap contains the 42 indexable locale routes. The two evidence-pending case-study hub pages are noindex and omitted.
- Old ad-campaigns and event-management service routes have explicit permanent successor redirects in `vercel.json`; no blanket homepage redirect exists.
- Global 404 contains a noindex bilingual recovery page. Vercel must return an actual 404 status for it.
- `npm run verify:export` checks all 44 content pages for language, direction, unique titles, H1 count, canonical, locale alternates, schema JSON, local references and sitemap policy.

After deployment, re-run HTTP tests and compare output with this baseline. Verify no production `X-Robots-Tag: noindex`, no authentication/interstitial, correct content type, and real 404s. Inspect redirect successors and one missing Arabic URL. Use Search Console live inspection to resolve crawler access; a successful spoofed user-agent request is insufficient.

## Monitoring ownership

Owner/hosting administrator: enable Vercel error/edge logs and an external uptime check for homepage, one service and robots.txt; investigate repeated 5xx with timestamps and request IDs. Review Search Console indexing and Crawl Stats weekly initially. No scheduled monitoring service was created in this task.
