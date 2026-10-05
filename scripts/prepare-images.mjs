import sharp from 'sharp';
import {stat} from 'node:fs/promises';
for(const name of ['creovo-reactive-hero','creovo-media-logo','gpt3','gpt6']){
 const src=`public/assets/${name}.png`,dest=`public/assets/${name}.webp`;
 await sharp(src).resize({width:name.includes('logo')?900:1680,withoutEnlargement:true}).webp({quality:86}).toFile(dest);
 console.log(`${name}: ${(await stat(src)).size} -> ${(await stat(dest)).size} bytes`);
}
await sharp('public/assets/creovo-media-logo.png').resize({width:320,withoutEnlargement:true}).webp({quality:90}).toFile('public/assets/creovo-media-logo-nav.webp');
