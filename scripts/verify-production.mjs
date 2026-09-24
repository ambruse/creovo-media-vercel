import {allRoutes,siteUrl,pageForRoute} from '../lib/site.js';
import {writeFile} from 'node:fs/promises';
const records=[],failures=[],paths=allRoutes().flatMap(p=>[p,'/ar'+p]),base=siteUrl();
for(let i=0;i<paths.length;i+=6)await Promise.all(paths.slice(i,i+6).map(async path=>{
 const response=await fetch(base+path,{signal:AbortSignal.timeout(20000)}),html=await response.text();
 const locale=path.startsWith('/ar/')?'ar':'en',route=locale==='ar'?path.slice(3):path;
 const record={path,status:response.status,canonical:html.match(/rel="canonical" href="([^"]+)/)?.[1],lang:html.match(/<html lang="([^"]+)/)?.[1],robots:html.match(/name="robots" content="([^"]+)/)?.[1]};
 const noindex=pageForRoute(route,locale).noindex||false;
 if(record.status!==200||record.canonical!==base+path||record.lang!==locale||Boolean(record.robots?.includes('noindex'))!==noindex)failures.push(record);
 records.push(record);
}));
for(const locale of ['','/ar'])for(const [old,next] of [['event-management','event-coverage'],['ad-campaigns','digital-marketing']])for(const slash of ['','/']){
 const path=`${locale}/services/${old}${slash}`,response=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});
 const record={path,status:response.status,location:response.headers.get('location')};records.push(record);
 let target=new URL(record.location||'/',base);
 // Next's static export normalizes missing trailing slashes before custom redirects.
 if(!slash&&target.pathname===`${path}/`){const normalized=await fetch(target,{redirect:'manual'});record.normalizationHop={status:normalized.status,location:normalized.headers.get('location')};target=new URL(record.normalizationHop.location||'/',base);}
 if(![301,308].includes(response.status)||(record.normalizationHop&&![301,308].includes(record.normalizationHop.status))||target.pathname!==`${locale}/services/${next}/`)failures.push(record);
}
for(const [path,expected] of [['/missing-creovo-audit/',404],['/ar/missing-creovo-audit/',404],['/robots.txt',200],['/sitemap.xml',200]]){
 const response=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(20000)}),record={path,status:response.status};records.push(record);if(response.status!==expected)failures.push(record);
}
await writeFile('docs/seo/deployment-validation.json',JSON.stringify({checkedAt:new Date().toISOString(),failures,records},null,2)+'\n');
console.log(JSON.stringify({pages:paths.length,requests:records.length,failures},null,2));if(failures.length)process.exitCode=1;
