import fs from 'node:fs/promises';
import path from 'node:path';
import {allRoutes,pageForRoute} from '../lib/site.js';
const folder=process.argv[2];
if(!folder)throw new Error('Pass the Search Console CSV directory.');
// Quoted fields and escaped quotes are supported; blank numeric cells stay null.
function csv(text){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value='';}else if(c==='\n'&&!quoted){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=c;}if(value||row.length){row.push(value.replace(/\r$/,''));rows.push(row);}const [header,...data]=rows;return data.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(header.map((h,i)=>[h.replace(/^\uFEFF/,''),r[i]??''])));}
const reports={};for(const name of ['Chart','Countries','Devices','Filters','Pages','Queries','Search appearance'])reports[name]=csv(await fs.readFile(path.join(folder,name+'.csv'),'utf8'));
const clicks=reports.Chart.reduce((n,r)=>n+Number(r.Clicks),0),impressions=reports.Chart.reduce((n,r)=>n+Number(r.Impressions),0);
const report={source:folder,dates:reports.Chart.map(r=>r.Date),clicks,impressions,ctr:clicks/impressions,weightedPosition:reports.Chart.reduce((n,r)=>n+Number(r.Position)*Number(r.Impressions),0)/impressions,notes:['Only seven daily rows despite Last 28 days filter.','Page and property impressions have different aggregation; do not add page impressions to property totals.','Query omissions mean visible query clicks are not total organic clicks.','No web-design row is not evidence of non-indexing.','All observations have low sample sizes; no statistically reliable uplift claim.'],reports};
await fs.mkdir('docs/seo',{recursive:true});
await fs.writeFile('docs/seo/search-baseline-2026-10-05.json',JSON.stringify(report,null,2)+'\n');
const target='docs/seo/pages-before-2026-10-05.json';
try{await fs.access(target);}catch{await fs.writeFile(target,JSON.stringify(['en','ar'].flatMap(locale=>allRoutes().map(route=>({locale,route,...pageForRoute(route,locale)}))),null,2)+'\n');}
console.log(JSON.stringify({clicks,impressions,days:report.dates.length,ctr:report.ctr}));
