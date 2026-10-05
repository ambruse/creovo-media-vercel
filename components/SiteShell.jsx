import { ui, localePath } from '../content/ui.mjs';
import { services } from '../content/services.mjs';
import SiteControls from './SiteControls';
export function Arrow(){return <svg className="ui-icon directional" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7"/></svg>;}
export function Button({href,children}) { return <a className="page-button" href={href}>{children}<Arrow/></a>; }
export function SiteShell({children,locale,route}) {
 const t=ui[locale],path=p=>localePath(p,locale), nav=['work','services','industries','about','insights'];
 return <div className={`${route==='/'?'':'page-body'} ${route==='/work/'?'work-route':''}`}>
  <a className="skip" href="#main">{t.skip}</a>
  <header className={`nav-shell ${route==='/'?'hero-nav':'page-nav'}`}>
   <a className="logo" href={path('/')} aria-label={`Creovo Media — ${t.home}`}><img src={route==='/'?'/assets/black-logo.png':'/assets/creovo-media-logo-nav.webp'} width={route==='/'?788:809} height={route==='/'?317:308} alt="Creovo Media"/></a>
   <nav aria-label={t.mainNav}>{nav.map(key=><a key={key} href={path(`/${key}/`)} aria-current={route.startsWith(`/${key}/`)?'page':undefined}>{t[key]}</a>)}</nav>
   <a className="language-switch" href={locale==='en'?`/ar${route}`:route} lang={locale==='en'?'ar':'en'} hrefLang={locale==='en'?'ar':'en'}>{locale==='en'?'العربية':'English'}</a>
   <a className="nav-cta" href={path('/contact/')}>{t.start}<Arrow/></a>
   <button id="menu-toggle" aria-label={t.menu} aria-controls="mobile-menu" aria-expanded="false"><span/><span/></button>
  </header>
  <dialog id="mobile-menu" aria-label={t.mainNav}><button className="menu-close">{t.close}</button><nav aria-label={t.mainNav}>{[...nav,'contact'].map((key,i)=><a key={key} href={path(`/${key}/`)}><small>{String(i+1).padStart(2,'0')}</small>{t[key]}</a>)}<a href={locale==='en'?`/ar${route}`:route} lang={locale==='en'?'ar':'en'}>{locale==='en'?'العربية':'English'}</a></nav><span className="micro">{t.tagline}</span></dialog>
  <main id="main">{children}</main>
  <footer className="page-footer"><div className="page-footer-lead"><p className="micro">{t.next}</p><h2>{t.footerHeading}</h2><Button href={path('/contact/')}>{t.start}</Button></div><div className="page-footer-grid"><div><a className="logo" href={path('/')}><img src="/assets/creovo-media-logo-nav.webp" width="809" height="308" alt="Creovo Media"/></a><p>{t.location}<br/>{t.serviceArea}</p><a href="tel:+97472357755" aria-label={`${t.phone}: +974 7235 7755`}><bdi>+974 7235 7755</bdi></a><p>{t.hours}</p><a href="https://www.instagram.com/creovo.qa/">{t.instagram}</a></div><nav aria-label={t.footerNav}>{services.map(s=><a key={s.slug} href={path(`/services/${s.slug}/`)}>{s.name[locale]}</a>)}</nav><nav aria-label={t.footerNav}>{['work','about','insights','contact','privacy'].map(key=><a key={key} href={path(`/${key}/`)}>{t[key]}</a>)}<button className="text-control" data-cookie-settings>{t.cookies}</button></nav></div><div className="page-footer-base"><span>© 2026 {t.rights}</span><a href="#main">{t.back}</a></div></footer>
  <SiteControls locale={locale}/>
 </div>;
}
