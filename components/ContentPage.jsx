import Script from 'next/script';
import { notFound } from 'next/navigation';
import { services,serviceBySlug } from '../content/services.mjs';
import { insights } from '../content/insights.mjs';
import { ui,localePath } from '../content/ui.mjs';
import { pageForRoute,structuredDataFor } from '../lib/site';
import { SiteShell,Button,Arrow } from './SiteShell';
import EnquiryForm from './EnquiryForm';
import WorkMedia from './WorkMedia';
import { industries } from '../content/industries.mjs';

function ServiceCards({locale,items=services,level=3}) { const t=ui[locale],Heading=`h${level}`;return <div className="card-grid">{items.map((s,i)=><a className="index-card" key={s.slug} href={localePath(`/services/${s.slug}/`,locale)}><span className="micro">{String(i+1).padStart(2,'0')}</span><Heading>{s.name[locale]}</Heading><p>{s.intro[locale]}</p><b>{t.viewService} <Arrow/></b></a>)}</div>; }
function InsightCards({locale,items=insights,level=3}) {const Heading=`h${level}`;return <div className="article-grid">{items.map(a=><a className="article-card" href={localePath(`/insights/${a.slug}/`,locale)} key={a.slug}><span className="micro">{ui[locale].author}</span><Heading>{a.title[locale]}</Heading><p>{a.description[locale]}</p><b>{ui[locale].read} <Arrow/></b></a>)}</div>;}
function Process({locale,service}){const t=ui[locale];return <section className="page-section"><h2 className="module-heading">{t.process}</h2><div className="process-grid">{t.processSteps.map((name,i)=><div key={name}><b>0{i+1}</b><h3>{name}</h3><p>{service?.process[locale][i]||t.processText[i]}</p></div>)}</div></section>;}
export default function ContentPage({route,locale}) {
 const t=ui[locale],path=p=>localePath(p,locale),page=pageForRoute(route,locale);if(!page)notFound();const s=page.service,a=page.article;
 return <><SiteShell route={route} locale={locale}>
 {structuredDataFor(page,route,locale).map((entry,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(entry).replaceAll('<','\\u003c')}}/>)}
 {route==='/'?<>
  <section id="home" className="hero"><div className="media-viewfinder" aria-hidden="true"><img className="webgl-fallback" src="/assets/creovo-reactive-hero.webp" width="1679" height="937" alt="" fetchPriority="high"/><canvas id="media-webgl"/><div className="viewfinder-vignette"/><div className="viewfinder-frame"><i className="corner corner-tl"/><i className="corner corner-tr"/><i className="corner corner-bl"/><i className="corner corner-br"/></div><div className="focus-reticle"><span/></div></div><div className="hero-top micro"><span>{t.independent}</span><span>{t.location}</span></div><div className="hero-title"><h1 className="hero-mark"><img src="/assets/creovo-media-logo.webp" alt="Creovo Media" width="809" height="308"/><span className="hero-seo-line">{t.heroLine}</span></h1></div><div className="hero-bottom"><a className="round-action" href="#work" aria-label={t.viewWork}><Arrow/></a><p>{t.heroCopy}</p><a className="line-link" href={path('/contact/')}>{t.start}<Arrow/></a></div><div className="hero-caption micro"><a href="#about">{t.scroll}</a><button id="tilt-control" data-active={t.tiltActive} data-unavailable={t.tiltUnavailable} hidden>{t.tilt}</button><button id="motion-toggle" aria-pressed="false" data-pause={t.pauseMotion} data-resume={t.resumeMotion}>{t.pauseMotion}</button></div></section>
  <section className="manifesto section" id="about"><div className="section-label"><span>01</span><span>Creovo Media</span><span>{t.location}</span></div><div className="manifesto-body"><p className="micro">{t.tagline}</p><div><h2 className="statement">{t.statement}<br/><span>{t.statementEnd}</span></h2><div className="manifesto-note"><p>{t.manifesto}</p></div></div></div></section>
  <section className="work" id="work"><WorkMedia mode="universe" locale={locale}/></section>
  <section className="page-section capabilities" id="services"><div className="work-heading"><h2>{t.serviceHeading}</h2><p>{t.serviceIntro}</p></div><ServiceCards locale={locale}/></section>
  <section className="page-section split-section"><div><p className="micro">{t.about}</p><h2>{t.aboutHeading}</h2></div><div className="long-copy"><p>{t.aboutIntro}</p><Button href={path('/about/')}>{t.about}</Button></div></section>
  <section className="page-section"><h2 className="module-heading">{t.insightHeading}</h2><InsightCards locale={locale}/></section>
  <Script src="/hero.js" strategy="afterInteractive"/>
 </>:<>
  <nav className="breadcrumbs" aria-label={t.breadcrumb}><a href={path('/')}>{t.home}</a><span>/</span>{(s||a)&&<><a href={path(s?'/services/':'/insights/')}>{s?t.services:t.insights}</a><span>/</span></>}<span aria-current="page">{s?.name[locale]||page.heading}</span></nav>
  <section className={`page-hero ${s?'service-hero':''}`}><div><p className="micro">Creovo Media / {s?s.name[locale]:t.location}</p><h1>{page.heading}</h1>{s&&<p className="service-creative-line">{s.creativeHeading[locale]}</p>}</div><p className="page-intro">{s?.intro[locale]||page.intro||page.description}</p><Button href={path('/contact/')+(s?`?service=${s.slug}`:'')}>{s?.cta[locale]||t.start}</Button></section>
  {s&&<>
   <section className="page-section"><h2 className="module-heading">{t.capabilities}</h2><div className="feature-grid">{s.capabilities[locale].map((v,i)=><article className="feature" key={v}><span>0{i+1}</span><h3>{v}</h3></article>)}</div></section>
   <section className="page-section split-section"><h2>{t.outputs}</h2><div className="long-copy"><p>{s.deliverables[locale]}</p><p>{t.scope}</p></div></section>
   {(s.sections||[]).map((section,i)=><section className="page-section split-section" key={i}><h2>{section.heading[locale]}</h2><div className="long-copy"><p>{section.body[locale]}</p>{s.slug==='web-design'&&i===1&&<a className="text-link" href={localePath('/',locale==='en'?'ar':'en')} lang={locale==='en'?'ar':'en'}>{locale==='en'?'Explore this website in Arabic':'استكشف هذا الموقع بالإنجليزية'}</a>}</div></section>)}
   <section className="page-section split-section"><h2>{t.approach}</h2><div className="long-copy"><p>{s.approach[locale]}</p><a className="text-link" href={path('/work/')}>{t.viewWork}</a></div></section>
   <Process locale={locale} service={s}/>
   <section className="page-section buyer-questions"><h2 className="module-heading">{t.questions}</h2>{s.questions.map((q,i)=><details key={i}><summary>{q[locale]}</summary><p>{s.answers[i][locale]}</p></details>)}</section>
   <section className="page-section"><h2 className="module-heading">{t.related}</h2><ServiceCards locale={locale} items={s.related.map(slug=>serviceBySlug[slug])}/>{insights.some(i=>i.service===s.slug)&&<div className="related-insights"><InsightCards locale={locale} items={insights.filter(i=>i.service===s.slug)}/></div>}<Button href={path('/contact/')+`?service=${s.slug}`}>{s.cta[locale]}</Button></section>
  </>}
  {route==='/services/'&&<section className="page-section"><ServiceCards locale={locale} level={2}/></section>}
  {route==='/work/'&&<section className="portfolio-section"><WorkMedia mode="portfolio" locale={locale}/></section>}
  {route==='/case-studies/'&&<section className="page-section"><Button href={path('/work/')}>{t.caseCta}</Button></section>}
  {route==='/about/'&&<><section className="page-section split-section"><h2>{t.statement}</h2><div className="long-copy"><p>{t.aboutSecond}</p><p>{t.location}<br/>{t.serviceArea}</p><Button href={path('/work/')}>{t.viewWork}</Button></div></section><Process locale={locale}/></>}
  {route==='/industries/'&&<section className="page-section"><ul className="sector-list">{t.sectors.map((v,i)=><li key={v}><h2>{v}</h2><p className="sector-description">{industries[i].body[locale]}</p><div className="sector-links">{industries[i].services.map(slug=><a className="text-link" href={path(`/services/${slug}/`)} key={slug}>{serviceBySlug[slug].name[locale]} <Arrow/></a>)}</div></li>)}</ul><Button href={path('/services/')}>{t.services}</Button></section>}
  {route==='/insights/'&&<section className="page-section"><InsightCards locale={locale} level={2}/></section>}
  {a&&<article className="article-page"><p className="micro">{t.author}</p><div className="article-copy">{a.sections.map(([heading,body],i)=><section key={i}><h2>{heading[locale]}</h2><p>{body[locale]}</p></section>)}</div><Button href={path(`/services/${a.service}/`)}>{serviceBySlug[a.service].name[locale]}</Button></article>}
  {route==='/contact/'&&<section className="page-section contact-layout"><EnquiryForm locale={locale} options={services.map(s=>({value:s.slug,label:s.name[locale]}))}/><aside className="contact-aside"><h2>{t.location}</h2><p>{t.serviceArea}</p><a href="tel:+97472357755"><bdi>+974 7235 7755</bdi></a><p>{t.hours}</p><a href="https://www.instagram.com/creovo.qa/">Instagram</a></aside></section>}
  {route==='/privacy/'&&<article className="legal-page">{[t.privacyForm,t.privacyAnalytics,t.privacyContact].map(v=><section key={v}><p>{v}</p></section>)}</article>}
 </>}
 </SiteShell></>;
}
