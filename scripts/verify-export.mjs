import {readFile,access,writeFile,mkdir} from 'node:fs/promises';
import {allRoutes,pageForRoute,metadataFor,siteUrl} from '../lib/site.js';
import {services} from '../content/services.mjs';
import {ui} from '../content/ui.mjs';
const failures=[],pages=[],canonicalHost=siteUrl();
const check=(condition,message)=>{if(!condition)failures.push(message);};
check(JSON.stringify(Object.keys(ui.en).sort())===JSON.stringify(Object.keys(ui.ar).sort()),'UI dictionary key parity');
for(const s of services){for(const key of ['name','title','heading','intro','capabilities','deliverables','approach'])check(Boolean(s[key].en&&s[key].ar),`${s.slug}: missing translation ${key}`);}
const sitemap=await readFile('out/sitemap.xml','utf8');
const titles=new Set(),descriptions=new Set(),links=new Map();
for(const locale of ['en','ar'])for(const route of allRoutes()){
 const url=locale==='ar'?`/ar${route}`:route;
 const html=await readFile(`out${url}index.html`,'utf8');
 const page=pageForRoute(route,locale),meta=metadataFor(route,locale);
 check(html.includes(`<html lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}"`),`${url}: html language/direction`);
 check((html.match(/<h1(?:\s|>)/g)||[]).length===1,`${url}: exactly one H1`);
 check(html.includes(`rel="canonical" href="${canonicalHost}${url}"`),`${url}: self canonical`);
 check((html.match(/rel="canonical"/g)||[]).length===1,`${url}: exactly one canonical`);
 check(Boolean(page.description.trim()),`${url}: empty description`);
 check(!descriptions.has(page.description),`${url}: duplicate description`);descriptions.add(page.description);
 check(html.includes('name="twitter:card"')&&html.includes('property="og:title"'),`${url}: social metadata`);
 check(html.includes(`property="og:type" content="${page.article?'article':'website'}"`),`${url}: OG type`);
 let previousHeading=0;for(const heading of html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)){const level=Number(heading[1]);check(level<=previousHeading+1,`${url}: skipped heading level h${previousHeading} to h${level}`);previousHeading=level;}
 for(const image of html.matchAll(/<img\b[^>]*>/g))check(/\balt="[^"]*"/.test(image[0]),`${url}: image missing alt`);
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
 check(main.includes('<h1')&&main.includes('<p'),`${url}: semantic primary content in HTML`);
 links.set(url,[...html.matchAll(/<a\b[^>]*href="(\/[^"#]*)/g)].map(m=>m[1].split('?')[0]));
 for(const [lang,target] of Object.entries(meta.alternates.languages))check(html.includes(`hrefLang="${lang}" href="${target}"`),`${url}: alternate ${lang}`);
 check(!titles.has(page.title),`${url}: duplicate title`);titles.add(page.title);
 check(page.noindex?html.includes('noindex'):html.includes('index, follow'),`${url}: robots`);
 check(page.noindex?!sitemap.includes(`<loc>${canonicalHost}${url}</loc>`):sitemap.includes(`<loc>${canonicalHost}${url}</loc>`),`${url}: sitemap indexing policy`);
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];check(schemas.length===1,`${url}: exactly one JSON-LD graph`);
 for(const match of schemas){try{const json=JSON.parse(match[1]),graph=json['@graph'];check(graph.filter(n=>n['@type']==='Organization').length===1,`${url}: organization schema`);check(graph.find(n=>n['@type']==='WebPage')?.url===canonicalHost+url,`${url}: schema canonical`);if(page.service)check(graph.filter(n=>n['@type']==='Service').length===1,`${url}: service schema`);if(page.article)check(graph.filter(n=>n['@type']==='Article').length===1,`${url}: article schema`);check(!graph.some(n=>n.aggregateRating||n.priceRange),`${url}: no unverified claims`);}catch{failures.push(`${url}: invalid JSON-LD`);}}
 for(const m of html.matchAll(/(?:href|src|poster)="(\/[^"#]*)(?:#[^"]*)?"/g)){
  const pathname=decodeURIComponent(m[1].split('?')[0]);if(pathname.startsWith('/_next/'))continue;
  const file=`out${pathname}${pathname.endsWith('/')?'index.html':''}`;
  try{await access(file);}catch{failures.push(`${url}: broken local reference ${pathname}`);}
 }
 pages.push({url,title:page.title,h1:page.heading,description:page.description,indexable:!page.noindex,locale});
}
check((await readFile('out/404.html','utf8')).includes('noindex'),'404 must be noindex');
for(const p of pages.filter(p=>p.indexable))check([...links].some(([source,targets])=>source!==p.url&&targets.includes(p.url)),`${p.url}: orphan page`);
check((sitemap.match(/<loc>/g)||[]).length===pages.filter(p=>p.indexable).length,'Sitemap has only indexable content URLs');
check(!sitemap.includes('<lastmod>'),'No invented last-modified dates');
const robots=await readFile('out/robots.txt','utf8');check(robots.includes('Allow: /')&&robots.includes(`${canonicalHost}/sitemap.xml`),'Robots allows public content and points to sitemap');
await mkdir('docs/seo',{recursive:true});
await writeFile('docs/seo/export-validation.json',JSON.stringify({checkedAt:new Date().toISOString(),pages:pages.length,failures:[...new Set(failures)]},null,2)+'\n');
const escape=s=>s.replaceAll('|','\\|').replaceAll('\n',' ');
await writeFile('SEO-PAGE-MATRIX.md',`# Creovo page matrix\n\nGenerated by npm run verify:export from the shared content model. Each English route has a self-canonical Arabic counterpart. Indexing is disabled on the case-study holding page until evidence is approved.\n\n| URL | Language | Title | H1 | Description | Indexable |\n|---|---|---|---|---|---|\n${pages.map(p=>`| ${p.url} | ${p.locale} | ${escape(p.title)} | ${escape(p.h1)} | ${escape(p.description)} | ${p.indexable?'Yes':'No'} |`).join('\n')}\n`);
console.log(`${pages.length} pages checked; ${failures.length} failures.`);if(failures.length){console.error([...new Set(failures)].join('\n'));process.exitCode=1;}
