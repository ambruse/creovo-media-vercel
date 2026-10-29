'use client';
import { useEffect,useRef,useState } from 'react';
import { workVideos,workPath,workTitle } from '../lib/work-videos';
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
const portraitFilm={id:'creovo-work-scenes',src:'/videos/work/creovo-work-scenes.mp4',poster:'/videos/posters/creovo-work-scenes.jpg',width:1080,height:1920,duration:'00:36',durationAr:'٠٠:٣٦'};
const landscapeFilm={id:'creovo-work-landscape',src:'/videos/work/creovo-work-landscape.mp4',poster:'/videos/posters/creovo-work-landscape.jpg',width:1920,height:1080,duration:'00:44',durationAr:'٠٠:٤٤'};
function SingleWorkFilm({label,locale,film=portraitFilm}){
 const figure=useRef(null),video=useRef(null),playerDialog=useRef(null),player=useRef(null);
 const landscape=film.width>film.height;
 useEffect(()=>{
  const frame=figure.current,el=video.current;if(!frame||!el)return;
  const item={src:film.src,ratio:0,allowed:true};candidates.set(el,item);
  const observer=new IntersectionObserver(([entry])=>{item.ratio=entry.isIntersecting?entry.intersectionRatio:0;frame.toggleAttribute('data-visible',item.ratio>.2);reconcile();},{threshold:[0,.2,.5,.75,1]});observer.observe(frame);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  document.addEventListener('visibilitychange',reconcile);document.addEventListener('creovo-motion',reconcile);reduced.addEventListener('change',reconcile);addEventListener('resize',reconcile,{passive:true});
  return()=>{observer.disconnect();el.pause();el.removeAttribute('src');el.load();candidates.delete(el);document.removeEventListener('visibilitychange',reconcile);document.removeEventListener('creovo-motion',reconcile);reduced.removeEventListener('change',reconcile);removeEventListener('resize',reconcile);};
 },[film]);
 const openPlayer=()=>{
  const dialog=playerDialog.current,full=player.current;if(!dialog||!full||dialog.open)return;
  playerOpen=true;reconcile();dialog.showModal();if(!full.src){full.src=film.src;full.load();}full.play().catch(()=>{});
  track('portfolio_interaction',{video_id:film.id});
 };
 const closePlayer=()=>{
  const full=player.current;full?.pause();if(full){full.removeAttribute('src');full.load();}
  playerOpen=false;reconcile();
 };
 return <figure ref={figure} className={`universe-film universe-film--${landscape?'landscape':'portrait'}`} style={{'--film-ratio':`${film.width} / ${film.height}`}}>
  <div className="universe-film-frame"><video ref={video} poster={film.poster} width={film.width} height={film.height} muted loop playsInline preload="none" aria-hidden="true"/><button type="button" className="universe-film-play" onClick={openPlayer} aria-label={`${locale==='ar'?'شاهد الفيلم':'Play the film'} — ${label}`}><span className="universe-film-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span><span>{locale==='ar'?'شاهد الفيلم':'PLAY FILM'}</span><svg className="universe-film-play-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5"/></svg></button></div>
  <figcaption className="universe-film-caption"><span className="micro">CREOVO MEDIA / {locale==='ar'?'لقطات من أعمالنا':'WORK IN MOTION'}</span><span className="universe-film-live" aria-hidden="true"><i/> {locale==='ar'?`فيلم أصلي · ${film.durationAr}`:`ORIGINAL FILM · ${film.duration}`}</span></figcaption>
  <dialog ref={playerDialog} className={`universe-player-dialog${landscape?' universe-player-dialog--landscape':''}`} aria-label={label} onClose={closePlayer}><header className="universe-player-top"><span className="micro">CREOVO MEDIA <i/> {locale==='ar'?'الفيلم الكامل':'THE FULL FILM'}</span><button type="button" className="film-close" onClick={()=>playerDialog.current?.close()} aria-label={locale==='ar'?'إغلاق المشغل':'Close player'}>{locale==='ar'?'إغلاق':'CLOSE'}</button></header><video ref={player} controls playsInline preload="none" aria-label={label}/></dialog>
 </figure>;
}
export default function WorkMedia({mode='portfolio',locale='en'}){
 const t=ui[locale],videos=mode==='universe'?[]:workVideos;
 const [selected,setSelected]=useState(null),[failed,setFailed]=useState(false),[pageSize,setPageSize]=useState(6);
 const section=useRef(null),dialog=useRef(null),full=useRef(null),started=useRef(false);
 useEffect(()=>()=>{playerOpen=false;},[]);
 useEffect(()=>{if(selected){setFailed(false);dialog.current.showModal();track('portfolio_interaction',{video_id:selected.id});}},[selected]);
 const open=v=>{playerOpen=true;started.current=false;for(const [el] of candidates)el.pause();setSelected(v);};
 const close=()=>{full.current?.pause();dialog.current?.close();setSelected(null);playerOpen=false;reconcile();};
 return <section ref={section} className={`work-experience ${mode==='universe'?'spatial-universe':'editorial-portfolio'}`} aria-label={mode==='universe'?t.universe:t.portfolio}>
  <div className="work-experience-inner"><header className="work-experience-heading"><p className="micro">{mode==='universe'?t.universe:t.portfolio}</p><h2>{mode==='universe'?t.ourWork:t.stories}<br/><em>{mode==='universe'?t.inMotion:t.move}</em></h2><p>{t.scrollWork}</p></header>
   {mode==='universe'?<div className="work-scenes"><SingleWorkFilm film={landscapeFilm} label={locale==='ar'?'فيلم أفقي':'Landscape film'} locale={locale}/><SingleWorkFilm label={`${t.ourWork} ${t.inMotion}`} locale={locale}/></div>:<div className="work-scenes">{videos.slice(0,pageSize).map((v,i)=><article key={v.id} className={`work-scene scene-${i} ${i===0?'dominant':''}`} style={{'--media-ratio':`${v.width} / ${v.height}`}}>
    <button className="scene-open" onClick={()=>open(v)} aria-label={`${t.play} — ${workTitle(v,locale)}`}><Preview video={v}/><span className="scene-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7z"/></svg></span></button>
    <div className="scene-caption"><span className="micro">Creovo Media / {String(v.number).padStart(2,'0')}</span><h3><a href={localePath(workPath(v),locale)}>{workTitle(v,locale)}</a></h3><a href={localePath('/contact/',locale)+'?service=content-creation'}>{t.similar}</a>{mode==='portfolio'&&<a className="work-service-link" data-portfolio-service="content-creation" href={localePath('/services/content-creation/',locale)}>{locale==='ar'?'خدمة صناعة المحتوى':'Content creation service'}</a>}</div>
   </article>)}</div>}
   {mode==='universe'?<a className="universe-work-link" href={localePath('/work/',locale)}>{t.viewWork}</a>:pageSize<videos.length&&<button className="page-button load-work" onClick={()=>setPageSize(n=>n+6)}>{locale==='ar'?'شاهد المزيد من الأعمال':'More work'}</button>}
  </div>
  <dialog className="film-dialog" ref={dialog} onCancel={close} onClose={()=>{full.current?.pause();setSelected(null);playerOpen=false;reconcile();}} aria-label={t.play}><button className="film-close" onClick={close}>{t.close}</button>{selected&&<><h2>{workTitle(selected,locale)}</h2><video ref={full} src={selected.src} poster={selected.poster} controls playsInline preload="metadata" onError={()=>setFailed(true)} onPlay={()=>{if(!started.current){track('video_start',{video_id:selected.id});started.current=true;}}} onEnded={()=>track('video_complete',{video_id:selected.id})} aria-label={workTitle(selected,locale)}/>{failed&&<p role="status">{t.videoError}</p>}<a href={selected.src}>{t.openVideo}</a></>}</dialog>
 </section>;
}
