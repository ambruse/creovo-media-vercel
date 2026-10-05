'use client';
import { useEffect,useRef,useState } from 'react';
import { workVideos,getRandomWorkVideos,workTitle } from '../lib/work-videos';
import { ui,localePath } from '../content/ui.mjs';
import { track } from '../lib/analytics';

// A page-wide playback budget: 1 preview on narrow screens, 2 on desktop.
const candidates=new Map();
let playerOpen=false;
function reconcile(){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const budget=innerWidth<901?1:2;
 const chosen=[...candidates].filter(([,v])=>v.ratio>.2&&v.allowed).sort((a,b)=>b[1].ratio-a[1].ratio).slice(0,budget).map(([el])=>el);
 for(const [el,entry] of candidates){if(!playerOpen&&!document.hidden&&!reduced&&!document.body.classList.contains('paused')&&chosen.includes(el)){if(!el.getAttribute('src')){el.src=entry.src;el.load();}if(el.paused)el.play().catch(()=>{});}else el.pause();}
}
function Preview({video,allowed=true}){
 const ref=useRef(null);
 useEffect(()=>{
  const el=ref.current;const item={src:video.preview,ratio:0,allowed};candidates.set(el,item);
  const observer=new IntersectionObserver(([entry])=>{item.ratio=entry.isIntersecting?entry.intersectionRatio:0;reconcile();},{threshold:[0,.2,.5,.75,1]});observer.observe(el);
  document.addEventListener('visibilitychange',reconcile);document.addEventListener('creovo-motion',reconcile);const mq=matchMedia('(prefers-reduced-motion:reduce)');mq.addEventListener('change',reconcile);
  return()=>{observer.disconnect();el.pause();el.removeAttribute('src');el.load();candidates.delete(el);document.removeEventListener('visibilitychange',reconcile);document.removeEventListener('creovo-motion',reconcile);mq.removeEventListener('change',reconcile);};
 },[video]);
 useEffect(()=>{const entry=candidates.get(ref.current);if(entry){entry.allowed=allowed;reconcile();}},[allowed]);
 return <video ref={ref} poster={video.poster} width={video.width} height={video.height} muted loop playsInline preload="none" aria-hidden="true" className="work-preview"/>;
}
function SingleWorkFilm({label,locale}){
 const figure=useRef(null),video=useRef(null);
 useEffect(()=>{
  const frame=figure.current,el=video.current;if(!frame||!el)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false;
  const update=()=>{
   if(visible&&!el.src){el.src='/videos/work/creovo-work-scenes.mp4';el.load();}
   if(visible&&!reduced.matches&&!document.hidden&&!document.body.classList.contains('paused'))el.play().catch(()=>{});
   else el.pause();
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.25;frame.toggleAttribute('data-visible',visible);update();},{threshold:[0,.25,.5,1]});observer.observe(frame);
  document.addEventListener('visibilitychange',update);document.addEventListener('creovo-motion',update);reduced.addEventListener('change',update);
  return()=>{observer.disconnect();el.pause();el.removeAttribute('src');el.load();document.removeEventListener('visibilitychange',update);document.removeEventListener('creovo-motion',update);reduced.removeEventListener('change',update);};
 },[]);
 return <figure ref={figure} className="universe-film">
  <div className="universe-film-frame"><video ref={video} poster="/videos/posters/creovo-work-scenes.jpg" width="1080" height="1920" muted loop playsInline controls preload="none" aria-label={label}/></div>
  <figcaption className="universe-film-caption"><span className="micro">CREOVO MEDIA / {locale==='ar'?'لقطات من أعمالنا':'WORK IN MOTION'}</span><span className="universe-film-live" aria-hidden="true"><i/> {locale==='ar'?'فيلم أصلي · ٠٠:٣٦':'ORIGINAL FILM · 00:36'}</span></figcaption>
 </figure>;
}
export default function WorkMedia({mode='portfolio',locale='en'}){
 const t=ui[locale],count=mode==='universe'?0:workVideos.length;
 const [videos,setVideos]=useState(workVideos.slice(0,count)),[selected,setSelected]=useState(null),[failed,setFailed]=useState(false),[pageSize,setPageSize]=useState(6);
 const section=useRef(null),dialog=useRef(null),full=useRef(null),started=useRef(false);
 useEffect(()=>()=>{playerOpen=false;},[]);
 useEffect(()=>{if(mode==='universe')return;let previous;try{previous=sessionStorage.getItem(`creovo.first.${mode}`);}catch{}const chosen=getRandomWorkVideos(count,workVideos,previous);setVideos(chosen);try{sessionStorage.setItem(`creovo.first.${mode}`,chosen[0].id);}catch{}},[count,mode]);
 useEffect(()=>{if(selected){setFailed(false);dialog.current.showModal();track('portfolio_interaction',{video_id:selected.id});}},[selected]);
 const open=v=>{playerOpen=true;started.current=false;for(const [el] of candidates)el.pause();setSelected(v);};
 const close=()=>{full.current?.pause();dialog.current?.close();setSelected(null);playerOpen=false;reconcile();};
 return <section ref={section} className={`work-experience ${mode==='universe'?'spatial-universe':'editorial-portfolio'}`} aria-label={mode==='universe'?t.universe:t.portfolio}>
  <div className="work-experience-inner"><header className="work-experience-heading"><p className="micro">{mode==='universe'?t.universe:t.portfolio}</p><h2>{mode==='universe'?t.ourWork:t.stories}<br/><em>{mode==='universe'?t.inMotion:t.move}</em></h2><p>{t.scrollWork}</p></header>
   {mode==='universe'?<div className="work-scenes"><SingleWorkFilm label={`${t.ourWork} ${t.inMotion}`} locale={locale}/></div>:<div className="work-scenes">{videos.slice(0,pageSize).map((v,i)=><article key={v.id} className={`work-scene scene-${i} ${i===0?'dominant':''}`} style={{'--media-ratio':`${v.width} / ${v.height}`}}>
    <button className="scene-open" onClick={()=>open(v)} aria-label={`${t.play} — ${workTitle(v,locale)}`}><Preview video={v}/><span className="scene-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7z"/></svg></span></button>
    <div className="scene-caption"><span className="micro">Creovo Media / {String(v.number).padStart(2,'0')}</span><h3>{workTitle(v,locale)}</h3><a href={localePath('/contact/',locale)+'?service=content-creation'}>{t.similar}</a>{mode==='portfolio'&&<a className="work-service-link" data-portfolio-service="content-creation" href={localePath('/services/content-creation/',locale)}>{locale==='ar'?'خدمة صناعة المحتوى':'Content creation service'}</a>}</div>
   </article>)}</div>}
   {mode==='universe'?<a className="universe-work-link" href={localePath('/work/',locale)}>{t.viewWork}</a>:pageSize<videos.length&&<button className="page-button load-work" onClick={()=>setPageSize(n=>n+6)}>{locale==='ar'?'شاهد المزيد من الأعمال':'More work'}</button>}
  </div>
  <dialog className="film-dialog" ref={dialog} onCancel={close} onClose={()=>{full.current?.pause();setSelected(null);playerOpen=false;reconcile();}} aria-label={t.play}><button className="film-close" onClick={close}>{t.close}</button>{selected&&<><h2>{workTitle(selected,locale)}</h2><video ref={full} src={selected.src} poster={selected.poster} controls playsInline preload="metadata" onError={()=>setFailed(true)} onPlay={()=>{if(!started.current){track('video_start',{video_id:selected.id});started.current=true;}}} onEnded={()=>track('video_complete',{video_id:selected.id})} aria-label={workTitle(selected,locale)}/>{failed&&<p role="status">{t.videoError}</p>}<a href={selected.src}>{t.openVideo}</a></>}</dialog>
 </section>;
}
