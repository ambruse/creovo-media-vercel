# Creovo Media SEO implementation report — 5 October 2026

## 1. Files changed

- SEO and routing: `lib/site.js`, `content/page-search.mjs`, `content/service-search.mjs`, `content/industries.mjs`, `content/website-guide.mjs`, `content/services.mjs`, `content/insights.mjs`, `content/ui.mjs`.
- Rendering and measurement: `components/ContentPage.jsx`, `components/WorkMedia.jsx`, `components/SiteControls.jsx`, `components/SiteShell.jsx`, `lib/work-videos.js`, `content/video-details.mjs`, `public/localization.css`, `public/pages.css`.
- Media: `public/assets/creovo-media-logo-nav.webp`, `scripts/prepare-images.mjs`.
- Audit and QA: `scripts/seo-baseline.mjs`, `scripts/verify-export.mjs`, `scripts/preview-export.mjs`, the dated files in `docs/seo/`, and the generated `SEO-PAGE-MATRIX.md`.

## 2–3. Technical findings and fixes

The site uses the Next.js App Router with static export, bilingual catch-all routes and server-rendered content. The audit found a good canonical/hreflang/sitemap base and no accidental JavaScript-only service copy. It found generic hub metadata, article Open Graph pages marked as websites, nested H2 capability headings, generic portfolio labels, and an analytics event that classified every contact link as a service CTA.

Metadata is now centralized but page-specific. Articles use article Open Graph type. Capability and card heading levels follow their section context. Contact and service CTA events are distinct; phone, email and portfolio-to-service interactions have their own event names and remain consent-gated. Export verification now checks one H1 and canonical, unique titles/descriptions, social metadata, heading order, image alt attributes, schema count/types/canonical agreement, orphan risk, local assets, sitemap policy, robots, and absence of invented sitemap dates.

The preferred origin remains `https://www.creovomedia.com`. Existing service URLs and the verified redirects remain unchanged. The sitemap contains only canonical indexable content; the evidence-incomplete case-study holding route stays `noindex`.

## 4–6. On-page, website-design and homepage work

The homepage now owns the creative/digital media-company intent with a visible “Creative & Digital Media Company in Qatar” heading. Its first main text identifies Creovo Media as based in Al Wakrah and serving businesses across Qatar, including Doha and Lusail, without claiming offices there. Its title and description explain the connected offer naturally.

Every service has a clear commercial H1 while its former creative heading remains visible as supporting copy. Every service also has a concise search description, contextual CTA and service-specific four-step process in English and Arabic.

`/services/web-design/` retains its strong title and canonical URL. It now has an explicit H1, nine buyer FAQs, and sections covering Qatar service areas, mobile journeys, information architecture, UX/UI, responsive development, performance, accessibility, SEO foundations, Arabic/English and RTL behavior, redesign and migration planning, redirects, analytics, scope/pricing factors, ownership and handover. Claims about guaranteed rankings, fixed costs, timelines and unspecified platforms were excluded.

## 7. Internal linking

The existing home and footer links already expose all nine services. Related-service links retain the requested relationships. Industries now link each sector to relevant services using descriptive crawlable links. The web-design page links to Branding, SEO, its new supporting guide, Arabic/English equivalents and the work/contact paths. Portfolio entries link to Content Creation as the supported service classification.

## 8–10. Structured data, local SEO and Arabic

The existing single JSON-LD graph per page is retained. Organization, WebSite, WebPage, Service, Article and BreadcrumbList types remain evidence-backed. Organization location now expresses only the verified locality and country: Al Wakrah, QA. No rating, review, price range, street address, Doha office, publication date or VideoObject was invented.

English and Arabic remain complete equivalent routes with reciprocal `en-QA`, `ar-QA` and `x-default` alternates. Arabic renders with `lang="ar"` and `dir="rtl"`. New homepage, service, industry, FAQ and article copy was authored in both languages. Arabic keyword research remains a separate research task; literal translations were not presented as demand data.

## 11. Core Web Vitals and performance

High-quality `hq-v2` video previews and full source playback remain intact. The existing one-video mobile/two-video desktop playback budget, viewport loading, pause-outside-view, posters and reduced-motion behavior were preserved. A 320-pixel navigation/footer logo derivative replaces the 809-pixel asset in those small placements.

A local mobile Lighthouse run on the web-design page scored Performance 71, Accessibility 100, Best Practices 100 and SEO 100; LCP was 5.2 seconds, CLS 0 and total blocking time 60 ms. Local serving lacks production CDN/cache behavior, so this is directional. Render-blocking CSS/fonts and unused shared client code are the next performance opportunities. The design and typography were not degraded to chase a synthetic score.

## 12. Content and proof

Twenty-one work videos now have truthful bilingual titles based on their visible subject or source filename. Client identities, objectives and results remain unclaimed. A useful bilingual website-redesign checklist was added and links to the web-design service. Draft Catharei, Argus Shipping and Argus Computers records remain unpublished because the repository does not prove scope, results, rights or approval.

## 13. Business-owner input required

- Confirm the complete public street/address details only if customers can visit and the same address will be used on Google Business Profile.
- Confirm the business email, legal business name if different, and whether the published Saturday–Thursday 09:00–17:00 hours are current.
- Supply approved project briefs, services delivered, asset mapping, client permission and genuine outcomes for case studies.
- Confirm whether WordPress, Shopify, e-commerce, maintenance and specific integrations are actually sold before targeting them.
- Approve captions/transcripts and public client/creator naming before adding VideoObject or detailed project pages.

## 14. Off-site actions

Claim/verify Google Business Profile and Maps using the real Al Wakrah location; keep name, phone, hours, website and service areas consistent. Choose accurate primary/secondary categories, add real team/workplace/project photos, and list genuine services. Review credible Qatar directories plus relevant Clutch and Sortlist profiles. Ask real partners and clients for appropriate project attribution/backlinks and pursue genuine press mentions. Do not buy links, reviews or city listings.

## 15. URLs to request indexing after deployment

Start with:

1. `https://www.creovomedia.com/`
2. `https://www.creovomedia.com/services/web-design/`
3. `https://www.creovomedia.com/services/`
4. `https://www.creovomedia.com/services/content-creation/`
5. `https://www.creovomedia.com/services/social-media/`
6. `https://www.creovomedia.com/services/video-production/`
7. `https://www.creovomedia.com/services/branding/`
8. `https://www.creovomedia.com/services/digital-marketing/`
9. `https://www.creovomedia.com/services/seo/`
10. `https://www.creovomedia.com/services/event-coverage/`
11. `https://www.creovomedia.com/services/influencer-marketing/`
12. `https://www.creovomedia.com/insights/website-redesign-checklist/`

Submit the sitemap once at `https://www.creovomedia.com/sitemap.xml`; individual requests are a priority queue, not a requirement to submit every sitemap URL manually.

## 16. Next 28-day measurement

Use deployment day as an annotation, then compare the next complete 28 days with a complete preceding 28-day period. Track indexed status and crawl issues first. Then monitor impressions, clicks, CTR and average position by landing page, country, device and query; separate branded/non-branded terms; and review actual qualified enquiry submissions. Watch the home/media cluster and web-design page separately. Tiny query rows should trigger inspection, not automatic rewrites. Record form delivery and lead quality outside GA4 without sending personal form data into analytics.

## Before → after keyword-to-page map

| Page | Before | After / ownership |
|---|---|---|
| `/` | Creative/digital agency; media-company intent implicit | Media company in Qatar; creative/digital media company/agency Qatar |
| `/services/web-design/` | Strong title, abstract H1 and limited buyer detail | Website design/company Qatar; web design/development Qatar; Doha as service area; responsive and bilingual website design |
| `/services/video-production/` | Creative film phrase | Video production company Qatar |
| `/services/content-creation/` | Creative content phrase | Content creation agency Qatar |
| `/services/social-media/` | Purpose-led social phrase | Social media management agency Qatar |
| `/services/branding/` | Identity phrase | Branding agency Qatar |
| `/services/digital-marketing/` | Business-goal phrase | Digital marketing agency Qatar |
| `/services/seo/` | Search-discovery phrase | SEO agency Qatar |
| `/services/event-coverage/` | Moment/story phrase | Event coverage and videography Qatar |
| `/services/influencer-marketing/` | Creator/story phrase | Influencer marketing agency Qatar |
| `/insights/website-redesign-checklist/` | Did not exist | Informational redesign/migration checklist supporting web design; does not compete for the commercial service term |

## Evidence and limits

The supplied Search Console export contains 36 clicks and 102 impressions across only seven daily rows (23–29 September 2026), despite a Last 28 days filter. The homepage accounts for 34 clicks. Qatar accounts for 36 clicks. Page/property aggregation differs and low-volume queries may be omitted, so tables cannot be naively summed and “zero query clicks” does not mean zero organic traffic. This is an early baseline, not evidence of ranking improvement.

Implementation choices follow Google’s guidance to map URLs, maintain self-canonicals, update internal links and monitor Search Console during changes: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes. Organization data was limited to supported facts in line with Google’s Organization guidance: https://developers.google.com/search/docs/appearance/structured-data/organization.
