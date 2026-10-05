import fs from 'node:fs';
import sharp from 'sharp';
const m=JSON.parse(fs.readFileSync('content/video-manifest.json'));
const cells=await Promise.all(m.map(async(v,i)=>({input:await sharp('public'+v.poster).resize(175,180,{fit:'contain',background:'#171717'}).extend({bottom:30,background:'#ffffff'}).composite([{input:Buffer.from(`<svg width="175" height="30"><text x="6" y="20" font-size="11">${v.id}</text></svg>`),top:180,left:0}]).png().toBuffer(),left:i%7*175,top:Math.floor(i/7)*210})));
await sharp({create:{width:1225,height:630,channels:3,background:'#222'}}).composite(cells).png().toFile('docs/seo/media-audit.png');
