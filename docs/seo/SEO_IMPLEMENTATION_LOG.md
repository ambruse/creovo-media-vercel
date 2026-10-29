# SEO implementation log

| Date | URL | Issue | Evidence | Before | After | Reason | Keyword Cluster | Expected Benefit | Risk | Validation | Status | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-11 | All EN/AR routes | Canonical/redirect disagreement | Live www redirects to apex; before inventory | www canonical/schema/alternates/sitemap | apex from shared siteUrl | Match hosting destination | All | Consistent crawl/index signals | Medium consolidation | Build + 46 export checks pass | Deployed 19592ee; 58 live checks pass | Engineering |
| 2026-10-11 | Audit | Brittle lang parser and incomplete final URL evidence | data-dpl-id before lang triggers false failures | lang must be first attribute | attribute-independent parsing, redirect chain and rich URL inventory | Reliable regression detection | All | Detect genuine SEO regressions | Low | Production baseline captured | Implemented | Engineering |

No title, description, H1, visible copy, route, visual or video change. Prior 5 October reports retained. Source of new research: supplied 16-page PDF, primary Google documentation and search discovery; account data unavailable.

Post-deployment: 58 production endpoint/redirect checks passed. All 46 content routes returned 200 with canonical equal to final URL. Titles, descriptions, headings and anchors matched before crawl exactly. No live form submission or browser/CWV test performed.

---

## Weekly monitoring — 2026-10-18

Read-only production inspection completed; no website code, metadata, copy, visuals or videos changed. Evidence: `production-weekly-2026-10-18.json` and `conversion-weekly-2026-10-18.json`.

- 58 endpoint/redirect checks passed with zero failures. All 46 content routes returned HTTP 200 with canonical equal to the intended final URL, expected language/robots directives, one H1, hreflang and matching WebPage schema URL.
- www homepage redirects permanently (308) to the apex. Robots permits crawling and references the apex sitemap; sitemap contains 44 URLs. These are crawl/index eligibility signals, not proof of Google indexing or Google's selected canonical.
- Live contact page exposes the configured Formspree endpoint; live assets contain GA4 G-K55JL8J8LF, the Google tag loader, generate_lead and whatsapp_click events. WhatsApp destination is present and fetched script assets return 200. Local submit logic emits generate_lead after a successful HTTP response. No form was submitted and analytics receipt, attribution, inbox delivery and lead quality were not tested.
- GSC/GA4/GBP authenticated evidence remains unavailable; no rankings, account metrics, field CWV or full periodic review completion claimed. No new actionable regression identified.
- Earlier next-actions wording about confirming the GA4 ID in Vercel is superseded by the current shipped, hard-coded ID. Consent gating was removed at the owner's request; this monitoring run did not alter that decision. Account-level collection verification is still outstanding.

### Review cadence (anchored to 11 October implementation)

| Review | Due | Status |
|---|---|---|
| Weekly technical monitoring | 18 October 2026 | HTTP/source checks completed; account evidence unavailable |
| Fortnightly commercial clusters/action register | 25 October 2026 | Pending; do not mark full review complete without adequate evidence |
| Monthly language/device/Qatar performance | 11 November 2026 | Pending; earliest complete 28-day host-fix measurement ends 8 November |
| Quarterly competitor/technical | 11 January 2027 | Pending |
| Six-month positioning | 11 April 2027 | Pending |
| Annual strategy | 11 October 2027 | Pending |

Next weekly check: 25 October 2026. Preserve recent titles/H1 and the 28-day consolidation observation window. Existing account-data requests remain open; no repeated notification is needed for this unchanged limitation. No full fortnightly/monthly/quarterly/six-month/annual review dates were reset.

---

## Weekly monitoring and due fortnightly evidence review — 2026-10-27

Read-only live inspection: 58 checks, zero failures. All 46 content routes retain HTTP 200, intended final URL/canonical alignment, language, robots, H1 and schema/hreflang signals. Compared with 18 October, no differences were found in recorded statuses, final URLs, canonicals, languages, robots, titles, descriptions, headings, links, alternates or schemas. www still redirects 308 to apex; robots permits crawling and the sitemap still lists 44 URLs. Crawl eligibility is not confirmation of Google indexing.

Live contact markup and shipped JavaScript still contain the expected Formspree endpoint, WhatsApp destination, GA4 ID G-K55JL8J8LF, tag loader, generate_lead and whatsapp_click implementations. Fetched script resources returned 200. No enquiry was sent; delivery, event receipt/deduplication and qualified-lead attribution remain unverified. GSC, GA4 and GBP account evidence remains unavailable. Field CWV and current browser performance were not measured.

Evidence: `production-weekly-2026-10-27.json` and `conversion-weekly-2026-10-27.json`. Website source, visuals, video logic and SEO configuration were not changed. Routine generated URL inventory was restored; dated reports preserve this run's evidence.

Fortnightly review due 25 October: action register and existing commercial intent ownership reviewed against PAGE_OPTIMIZATION_PLAN, TECHNICAL_ISSUES, CONTENT_ROADMAP and LOCAL_SEO_PLAN. Existing service destinations remain available; no new evidence supports duplicate landing pages, title/H1 churn or expansion of business claims. Social management/content production and paid marketing/organic SEO remain separately mapped. Actual query cannibalization and commercial performance cannot be assessed without current query-by-page and conversion data. This is a partial evidence review, NOT a completed full fortnightly review; the original due date is retained. Existing account-data and client-approval dependencies are unchanged, so no repeated alert was sent.

| Review | Due / next checkpoint | Status |
|---|---|---|
| Weekly technical monitoring | 27 October checked; next 1 November 2026 | HTTP/source checks passed |
| Fortnightly commercial review | 25 October 2026; reassess evidence 1 November | Partial; full review remains outstanding |
| Monthly Qatar/language/device review | 11 November 2026 | Pending; earliest full 28-day host-fix window ends 8 November |
| Quarterly competitor/technical | 11 January 2027 | Pending |
| Six-month positioning | 11 April 2027 | Pending |
| Annual strategy | 11 October 2027 | Pending |

No full periodic review dates reset. Preserve the existing 2–4 November title/H1 protection and 8 November consolidation measurement window; dates alone do not justify changes. No new actionable regression or required decision beyond previously recorded dependencies.
