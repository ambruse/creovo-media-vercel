# Technical issue register — 11 October 2026

| Priority | Affected URL | Evidence | Change | Risk | Validation/status |
|---|---|---|---|---|---|
| P1 | All 46 routes, sitemap, robots | www redirects to apex, canonical/schema/alternates point back to www | Align shared origin with actual apex destination | Medium: canonical recrawl/host consolidation; paths retained | Export passes; 58 post-deployment checks pass |
| P2 | Audit tooling | Regex required lang as first HTML attribute; Vercel prepends data-dpl-id | Parse attributes independent of ordering, record final response URL and hops | Low | New audit-search.mjs |
| P1 | Measurement | No current GSC/GA4/GBP authenticated data | Obtain Qatar query/page and conversion baselines | None | Blocked by access |
| P2 | Portfolio/case studies | Case-study holding page lacks approved scope/outcomes | Keep noindex; collect project facts and permissions | High if fabricated | Needs business verification |
| P2 | Performance | Historical mobile lab LCP 5.2s | Re-measure field/lab before optimizing | Unknown | Needs current measurement |

No evidence justifies duplicate city, typo or synonym pages. No schema ratings, price claims, invented VideoObject dates or AI-specific markup added. Missing routes checked separately from real content. JSON-LD syntax checks are not Google rich-result certification.
