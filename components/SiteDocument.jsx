import '../app/root.css';
export const verification = {
 google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
 other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? {'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} : undefined,
};
export default function SiteDocument({locale,children}) {
 return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><head><link rel="icon" href="/assets/t-logo-favicon.png" type="image/png" sizes="64x64"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href={`https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700${locale==='ar'?'&family=Noto+Sans+Arabic:wght@400;500;600;700':''}&display=swap`} rel="stylesheet"/><link rel="stylesheet" href="/styles.css"/><link rel="stylesheet" href="/pages.css"/><link rel="stylesheet" href="/localization.css"/></head><body>{children}</body></html>;
}
