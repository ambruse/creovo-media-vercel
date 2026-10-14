import { ui, localePath } from '../content/ui.mjs';
import { services } from '../content/services.mjs';
import SiteControls from './SiteControls';
export function Arrow(){return <svg className="ui-icon directional" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7"/></svg>;}
export function Button({href,children}) { return <a className="page-button" href={href}>{children}<Arrow/></a>; }
export function SiteShell({children,locale,route}) {
 const t=ui[locale],path=p=>localePath(p,locale), nav=['work','services','industries','about','insights'];
 const whatsappUrl=`https://wa.me/97472357755?text=${encodeURIComponent('Hi, I came across your website and was interested in your services. I’d like to know more and make an enquiry.  ')}`;
 return <div className={`${route==='/'?'':'page-body'} ${route==='/work/'?'work-route':''}`}>
  <a className="skip" href="#main">{t.skip}</a>
  <header className={`nav-shell ${route==='/'?'hero-nav':'page-nav'}`}>
   <a className="logo" href={path('/')} aria-label={`Creovo Media — ${t.home}`}><img src="/assets/creovo-media-logo-nav.webp" width="809" height="308" alt="Creovo Media"/></a>
   <nav aria-label={t.mainNav}>{nav.map(key=><a key={key} href={path(`/${key}/`)} aria-current={route.startsWith(`/${key}/`)?'page':undefined}>{t[key]}</a>)}</nav>
   <a className="language-switch" href={locale==='en'?`/ar${route}`:route} lang={locale==='en'?'ar':'en'} hrefLang={locale==='en'?'ar':'en'}>{locale==='en'?'العربية':'English'}</a>
   <a className="nav-cta" href={path('/contact/')}>{t.start}<Arrow/></a>
   <button id="menu-toggle" aria-label={t.menu} aria-controls="mobile-menu" aria-expanded="false"><span/><span/></button>
  </header>
  <dialog id="mobile-menu" aria-label={t.mainNav}><button className="menu-close">{t.close}</button><nav aria-label={t.mainNav}>{[...nav,'contact'].map((key,i)=><a key={key} href={path(`/${key}/`)}><small>{String(i+1).padStart(2,'0')}</small>{t[key]}</a>)}<a href={locale==='en'?`/ar${route}`:route} lang={locale==='en'?'ar':'en'}>{locale==='en'?'العربية':'English'}</a></nav><span className="micro">{t.tagline}</span></dialog>
  <main id="main">{children}</main>
  <footer className="page-footer"><div className="page-footer-lead"><p className="micro">{t.next}</p><h2>{t.footerHeading}</h2><Button href={path('/contact/')}>{t.start}</Button></div><div className="page-footer-grid"><div><a className="logo" href={path('/')}><img src="/assets/creovo-media-logo-nav.webp" width="809" height="308" alt="Creovo Media"/></a><p>{t.location}<br/>{t.serviceArea}</p><a href="tel:+97472357755" aria-label={`${t.phone}: +974 7235 7755`}><bdi>+974 7235 7755</bdi></a><p>{t.hours}</p><a href="https://www.instagram.com/creovo.qa/">{t.instagram}</a></div><nav aria-label={t.footerNav}>{services.map(s=><a key={s.slug} href={path(`/services/${s.slug}/`)}>{s.name[locale]}</a>)}</nav><nav aria-label={t.footerNav}>{['work','about','insights','contact','privacy'].map(key=><a key={key} href={path(`/${key}/`)}>{t[key]}</a>)}</nav></div><div className="page-footer-base"><span>© 2026 {t.rights}</span><a href="#main">{t.back}</a></div></footer>
  <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp} title={t.whatsapp}>
   <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.16 1.6 5.98L.02 24l6.23-1.63a11.93 11.93 0 0 0 5.8 1.48h.01c6.58 0 11.93-5.35 11.94-11.93a11.85 11.85 0 0 0-3.48-8.44ZM12.06 21.83a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.52-5.3c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.02 2.91 9.84 9.84 0 0 1 2.9 7.02c0 5.46-4.45 9.9-9.96 9.89Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"/></svg>
  </a>
  <SiteControls locale={locale}/>
 </div>;
}
