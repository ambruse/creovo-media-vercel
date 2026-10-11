import {allRoutes,siteUrl,pageForRoute} from '../lib/site.js';
import {writeFile} from 'node:fs/promises';
const label=process.argv[2]||'latest',base=siteUrl(),records=[],failures=[];
async function inspect(path){
 const hops=[];let url=base+path;
 try{
 for(let i=0;i<8;i++){
 const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});const location=r.headers.get('location');hops.push({url,status:r.status,location});
 if(location&&r.status>=300&&r.status<400){url=new URL(location,url).href;continue;}
 const html=await r.text(),tag=html.match(/<html\b[^>]*>/i)?.[0]||'';
 const record={path,status:r.status,finalUrl:url,hops,canonical:html.match(/rel="canonical" href="([^"]+)/)?.[1],lang:tag.match(/\blang="([^"]+)/)?.[1],robots:html.match(/name="robots" content="([^"]+)/)?.[1],title:html.match(/<title>(.*?)<\/title>/)?.[1],description:html.match(/name="description" content="([^"]+)/)?.[1],headings:[...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(m=>({level:+m[1],text:m[2].replace(/<[^>]+>/g,'')})),links:[...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)/g)].map(m=>m[1]))],alternates:[...html.matchAll(/rel="alternate"[^>]+/g)].map(m=>m[0]),schemas:[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))};
 const locale=path.startsWith('/ar/')?'ar':'en',route=locale==='ar'?path.slice(3):path,page=pageForRoute(route,locale);
 if(page){if(r.status!==200||record.canonical!==url||url!==base+path||record.lang!==locale||Boolean(record.robots?.includes('noindex'))!==Boolean(page.noindex)||record.headings.filter(h=>h.level===1).length!==1)failures.push({path,reason:'status/canonical/final URL/language/robots/H1 mismatch'});}
 else if(path.includes('/services/event-management')||path.includes('/services/ad-campaigns')){const expected=path.replace('event-management','event-coverage').replace('ad-campaigns','digital-marketing').replace(/\/?$/,'/');if(r.status!==200||url!==base+expected||!hops.slice(0,-1).every(h=>[301,308].includes(h.status)))failures.push({path,reason:'legacy redirect target/status'});}
 else if(path.includes('missing-creovo')&&r.status!==404)failures.push({path,reason:'missing route must return 404'});
 if(page){
 for(const lang of ['en-QA','ar-QA','x-default'])if(!record.alternates.some(a=>a.includes(`hrefLang="${lang}"`)))failures.push({path,reason:'missing alternate '+lang});
 if(record.schemas.length!==1||record.schemas[0]['@graph']?.find(n=>n['@type']==='WebPage')?.url!==record.canonical)failures.push({path,reason:'schema/page canonical mismatch'});
 }
 if(path==='/sitemap.xml'&&(r.status!==200||html.includes('https://www.creovomedia.com')))failures.push({path,reason:'sitemap status/host conflict'});
 if(path==='/robots.txt'&&(r.status!==200||!html.includes(base+'/sitemap.xml')))failures.push({path,reason:'robots status/sitemap conflict'});
 records.push(record);return;
 }throw new Error('redirect limit');
 }catch(e){records.push({path,hops,error:e.message});failures.push({path,reason:e.message});}
}
const paths=allRoutes().flatMap(p=>[p,'/ar'+p]);
paths.push('/robots.txt','/sitemap.xml','/missing-creovo-audit/','/ar/missing-creovo-audit/',...['','/ar'].flatMap(l=>['event-management','ad-campaigns'].flatMap(p=>[`${l}/services/${p}`,`${l}/services/${p}/`])));
for(let i=0;i<paths.length;i+=4)await Promise.all(paths.slice(i,i+4).map(inspect));
await writeFile(`docs/seo/production-${label}.json`,JSON.stringify({checkedAt:new Date().toISOString(),base,failures,records},null,2)+'\n');
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
await writeFile(`docs/seo/URL_INVENTORY${label.includes('before')?'-before':''}.csv`,['URL,Status,Final URL,Canonical,Language,Title,Description,Robots,H1',...records.filter(r=>r.title).map(r=>[base+r.path,r.status,r.finalUrl,r.canonical,r.lang,r.title,r.description,r.robots,r.headings.filter(h=>h.level===1).map(h=>h.text).join(' | ')].map(csv).join(','))].join('\n')+'\n');
console.log(JSON.stringify({requests:records.length,failures},null,2));if(failures.length)process.exitCode=1;
