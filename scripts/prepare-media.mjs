import ffmpeg from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir,mkdir,writeFile,access } from 'node:fs/promises';
import path from 'node:path';
import {videoDetails} from '../content/video-details.mjs';
const run=promisify(execFile), dir='public/videos/work';
// Version the quality profile so existing compressed assets/browser caches cannot
// silently keep serving the old 640px, CRF29 previews. Preserve source resolution.
const profile='hq-v2';
await mkdir(`public/videos/previews/${profile}`,{recursive:true});await mkdir(`public/videos/posters/${profile}`,{recursive:true});
const manifest=[];
const files=(await readdir(dir)).filter(f=>/\.(mp4|mov|webm)$/i.test(f)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
for(const [index,file] of files.entries()){
 const id=path.parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),source=path.join(dir,file);
 let stderr='';try{await run(ffmpeg,['-hide_banner','-i',source]);}catch(e){stderr=e.stderr||'';}
 const dims=stderr.match(/Video:.*? (\d{2,5})x(\d{2,5})/),d=stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
 const width=Number(dims?.[1]||1080),height=Number(dims?.[2]||1920),duration=d?Number(d[1])*3600+Number(d[2])*60+Number(d[3]):null;
 const poster=`public/videos/posters/${profile}/${id}.jpg`,preview=`public/videos/previews/${profile}/${id}.mp4`;
 try{await access(poster);}catch{await run(ffmpeg,['-y','-ss','1','-i',source,'-frames:v','1','-q:v','2',poster]);}
 try{await access(preview);}catch{await run(ffmpeg,['-y','-i',source,'-t','10','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-threads','2',preview]);}
 if(manifest.some(v=>v.id===id))throw new Error(`Duplicate normalized video ID: ${id}. Rename one source before importing.`);
 manifest.push({id,file,src:`/videos/work/${encodeURIComponent(file)}`,preview:`/videos/previews/${profile}/${id}.mp4`,poster:`/videos/posters/${profile}/${id}.jpg`,width,height,duration,number:index+1,categories:[],client:null,uploadDate:null,...videoDetails[id]});
 console.log(`${index+1}/${files.length} ${file} ${width}x${height}`);
}
await writeFile('content/video-manifest.json',JSON.stringify(manifest,null,2)+'\n');
