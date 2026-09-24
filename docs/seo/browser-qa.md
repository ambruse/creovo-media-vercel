# Browser verification — 24 September 2026

Local Next.js preview, Chromium-based in-app browser. These observations are not physical-device or production-performance certification.

| Check | Result |
|---|---|
| Arabic desktop home | Camera artwork, centered readable logo, Arabic copy/navigation visible |
| Arabic Work at 390×844 | Portrait media fits, no horizontal page overflow; one preview playing |
| Work film dialog | Opens with focus on localized close control; background previews stop |
| Arabic contact, empty submit | Validation message is `يرجى إكمال هذا الحقل.`; no outbound submission |
| Mobile menu | Opens/closes; primary destinations plus equivalent-language link present |
| English SEO service at 1440×900 | Title, intro, nav and project CTA render cleanly |
| Language switch on SEO service | Navigates to `/ar/services/seo/`, `lang=ar`, `dir=rtl`, Arabic H1 |
| Arabic SEO service at 768×1024 | No page-width overflow; text and CTA align RTL |
| Refresh Arabic service | Language and direction retained |
| Browser console, inspected service flow | No captured errors |

Not tested: actual enquiry delivery, real GA account events, physical device orientation permissions, Safari/Firefox, hardware performance, real Googlebot or Vercel redirects until deployment. Reduced-motion and hidden-tab behavior are implemented in the shared manager and hero lifecycle; further hardware/browser matrix testing remains appropriate.
