import { services } from '../content/services.mjs';
import { insights } from '../content/insights.mjs';
import { ui, localePath } from '../content/ui.mjs';

// Use the verified serving host until the apex -> www redirect is reversed in Vercel.
// Never use preview environment URLs as canonicals.
export function siteUrl() { return 'https://www.creovomedia.com'; }
export const isPreview = process.env.VERCEL_ENV === 'preview';
export function allRoutes() { return ['/', '/services/', ...services.map(s=>`/services/${s.slug}/`), '/work/', '/case-studies/', '/about/', '/contact/', '/industries/', '/insights/', ...insights.map(s=>`/insights/${s.slug}/`), '/privacy/']; }
export function routeForSlug(slug) { return slug?.length ? `/${slug.join('/')}/` : '/'; }
export function pageForRoute(route, locale='en') {
  const t=ui[locale], service=services.find(s=>route===`/services/${s.slug}/`), article=insights.find(s=>route===`/insights/${s.slug}/`);
  if(service) return {title:`${service.title[locale]} | Creovo Media`,description:service.intro[locale],heading:service.heading[locale],service,image:'/assets/gpt3.webp'};
  if(article) return {title:`${article.title[locale]} | Creovo Media`,description:article.description[locale],heading:article.title[locale],article,image:'/assets/gpt6.webp'};
  const records={
    '/':[locale==='ar'?'وكالة إبداعية وإعلامية رقمية في قطر':'Creative & Digital Media Agency in Qatar',t.manifesto,t.heroLine],
    '/services/':[t.services,t.serviceIntro,t.serviceHeading], '/work/':[t.work,t.portfolioIntro,t.portfolio],
    '/case-studies/':[t.cases,t.caseIntro,t.caseHeading], '/about/':[t.about,t.aboutIntro,t.aboutHeading],
    '/contact/':[t.contact,t.contactIntro,t.start], '/industries/':[t.industries,t.industryIntro,t.industryHeading],
    '/insights/':[t.insights,t.insightIntro,t.insightHeading], '/privacy/':[t.privacy,t.privacyIntro,t.privacyHeading],
  };
  const r=records[route]; return r?{title:`${r[0]} | Creovo Media`,description:r[1],heading:r[2],image:'/assets/creovo-reactive-hero.webp',noindex:route==='/case-studies/'}:null;
}
export function languages(route) { return {'en-QA':`${siteUrl()}${route}`,'ar-QA':`${siteUrl()}/ar${route}`,'x-default':`${siteUrl()}${route}`}; }
export function metadataFor(route,locale='en') {
  const page=pageForRoute(route,locale); if(!page)return {};
  const url=`${siteUrl()}${localePath(route,locale)}`;
  return {metadataBase:new URL(siteUrl()),title:page.title,description:page.description,alternates:{canonical:url,languages:languages(route)},robots:{index:!isPreview&&!page.noindex,follow:true},openGraph:{type:'website',siteName:'Creovo Media',title:page.title,description:page.description,url,locale:locale==='ar'?'ar_QA':'en_QA',alternateLocale:locale==='ar'?'en_QA':'ar_QA',images:[{url:page.image,alt:page.heading}]},twitter:{card:'summary_large_image',title:page.title,description:page.description,images:[page.image]}};
}
export function structuredDataFor(page,route,locale='en') {
  const base=siteUrl(),url=`${base}${localePath(route,locale)}`;
  const organization={'@type':'Organization','@id':`${base}/#organization`,name:'Creovo Media',url:base,logo:`${base}/assets/creovo-media-logo.webp`,telephone:'+97472357755',sameAs:['https://www.instagram.com/creovo.qa/'],areaServed:{'@type':'Country',name:'Qatar'},location:{'@type':'Place',name:'Al Wakrah, Qatar'}};
  const graph=[organization,{'@type':'WebSite','@id':`${base}/#website`,url:base,name:'Creovo Media',inLanguage:['en-QA','ar-QA'],publisher:{'@id':organization['@id']}},{'@type':'WebPage','@id':`${url}#webpage`,url,name:page.title,description:page.description,inLanguage:locale==='ar'?'ar-QA':'en-QA',isPartOf:{'@id':`${base}/#website`},about:{'@id':organization['@id']}}];
  if(page.service)graph.push({'@type':'Service',name:page.service.name[locale],description:page.description,url,provider:{'@id':organization['@id']},areaServed:{'@type':'Country',name:'Qatar'}});
  if(page.article)graph.push({'@type':'Article',headline:page.article.title[locale],description:page.description,mainEntityOfPage:{'@id':`${url}#webpage`},author:{'@id':organization['@id']},publisher:{'@id':organization['@id']},inLanguage:locale});
  if(route!=='/') {
    const parent=page.service?'/services/':page.article?'/insights/':null;
    const crumbs=[{name:ui[locale].home,path:'/'},...(parent?[{name:parent==='/services/'?ui[locale].services:ui[locale].insights,path:parent}]:[]),{name:page.service?.name[locale]||page.heading,path:route}];
    graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:`${base}${localePath(c.path,locale)}`}))});
  }
  return [{'@context':'https://schema.org','@graph':graph}];
}
