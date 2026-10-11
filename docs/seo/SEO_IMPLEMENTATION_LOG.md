# SEO implementation log

| Date | URL | Issue | Evidence | Before | After | Reason | Keyword Cluster | Expected Benefit | Risk | Validation | Status | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-11 | All EN/AR routes | Canonical/redirect disagreement | Live www redirects to apex; before inventory | www canonical/schema/alternates/sitemap | apex from shared siteUrl | Match hosting destination | All | Consistent crawl/index signals | Medium consolidation | Build + 46 export checks pass | Implemented; deployment pending | Engineering |
| 2026-10-11 | Audit | Brittle lang parser and incomplete final URL evidence | data-dpl-id before lang triggers false failures | lang must be first attribute | attribute-independent parsing, redirect chain and rich URL inventory | Reliable regression detection | All | Detect genuine SEO regressions | Low | Production baseline captured | Implemented | Engineering |

No title, description, H1, visible copy, route, visual or video change. Prior 5 October reports retained. Source of new research: supplied 16-page PDF, primary Google documentation and search discovery; account data unavailable.
