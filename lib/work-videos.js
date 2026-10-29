import manifest from '../content/video-manifest.json' with {type:'json'};
import {videoDetails} from '../content/video-details.mjs';
export const workVideos=manifest.map(video=>({...video,...videoDetails[video.id]}));
export function workPath(video){return `/work/${video.id}/`;}
export function workDescription(video,locale){
 const seconds=new Intl.NumberFormat(locale==='ar'?'ar-QA':'en-QA',{maximumFractionDigits:1}).format(video.duration);
 return video.description?.[locale]||(locale==='ar'?`شاهد «${workTitle(video,locale)}» من أعمال Creovo Media. مدة الفيلم ${seconds} ثانية. استكشف الفيلم وناقش معنا مشروع محتوى مشابهاً.`:`Watch ${workTitle(video,locale)} from the Creovo Media portfolio. View the ${seconds}-second film and discuss a similar content project.`);
}
export function workTitle(video,locale){return video.title?.[locale]||(locale==='ar'?'فيلم مختار':'Selected film');}
export function getRandomWorkVideos(count=1,pool=workVideos,previousFirst=null){
 const result=[...pool];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(result.length>1&&result[0].id===previousFirst)[result[0],result[1]]=[result[1],result[0]];
 return result.slice(0,count);
}
export function getRandomWorkVideosByCategory(category,count=3){return getRandomWorkVideos(count,workVideos.filter(v=>v.categories.includes(category)));}
