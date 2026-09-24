import { writeFile, mkdir } from 'node:fs/promises';
const urls = ['https://creovomedia.com/', 'https://www.creovomedia.com/', 'http://creovomedia.com/', 'http://www.creovomedia.com/', ...['robots.txt','sitemap.xml','services/branding/','services/video-production/','work/','contact/','ar/','missing-creovo-audit/'].map(p => `https://www.creovomedia.com/${p}`)];
const results = [];
for (const url of urls) {
  for (const agent of url.endsWith('.com/') ? ['Mozilla/5.0', 'Googlebot', 'bingbot'] : ['Mozilla/5.0']) {
    let current = url; const hops = [];
    try {
      for (let n = 0; n < 6; n++) {
        const response = await fetch(current, { redirect: 'manual', headers: { 'User-Agent': agent }, signal: AbortSignal.timeout(20000) });
        const location = response.headers.get('location');
        hops.push({ url: current, status: response.status, location, robots: response.headers.get('x-robots-tag') });
        if (!location || response.status < 300 || response.status >= 400) {
          const body = await response.text();
          results.push({ url, agent, hops, canonical: body.match(/rel="canonical" href="([^"]+)/)?.[1], checkedAt: new Date().toISOString() });
          break;
        }
        current = new URL(location, current).href;
      }
    } catch (error) { results.push({ url, agent, hops, error: error.message }); }
  }
}
await mkdir('docs/seo', { recursive: true });
await writeFile('docs/seo/production-audit.json', JSON.stringify(results, null, 2));
console.log(results.map(r => `${r.url} [${r.agent}] ${r.hops.map(h=>h.status).join(' → ')} ${r.error || ''}`).join('\n'));
