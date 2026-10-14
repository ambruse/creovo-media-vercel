'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {ui} from '../content/ui.mjs';

const websites=[
 {domain:'catharei.com',image:'catharei',width:390,height:850},
 {domain:'argusshipping.co',image:'argusshipping',width:390,height:848},
 {domain:'churroscafeqa.com',image:'churroscafeqa',width:395,height:852},
];

export default function WebsiteShowcase({locale}){
 const t=ui[locale],rtl=locale==='ar';
 const [active,setActive]=useState(0),gesture=useRef(null),swiped=useRef(false);
 const step=direction=>setActive(index=>(index+direction+websites.length)%websites.length);
 const finishSwipe=e=>{
  const start=gesture.current;gesture.current=null;
  if(!start)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){swiped.current=true;step((dx<0?1:-1)*(rtl?-1:1));}
 };
 return <div className="website-showcase" role="region" aria-roledescription={t.websiteCarousel} aria-label={t.websiteProjects}>
  <div className="website-stack" onPointerDown={e=>{swiped.current=false;gesture.current={x:e.clientX,y:e.clientY};}} onPointerUp={finishSwipe} onPointerCancel={()=>{gesture.current=null;}} onClickCapture={e=>{if(swiped.current){e.preventDefault();swiped.current=false;}}}>
   {websites.map((site,index)=>{
    const offset=(index-active+websites.length)%websites.length,position=offset===2?-1:offset;
    return <a key={site.domain} className={`website-preview${index===active?' is-active':''}`} style={{'--slide-offset':position*(rtl?-1:1)}} href={`https://${site.domain}/`} target="_blank" rel="noopener noreferrer" tabIndex={index===active?0:-1} aria-label={`${site.domain} — ${t.websiteNewTab}`} draggable="false">
     <Image src={`/images/websites/${site.image}.webp`} alt={site.domain} width={site.width} height={site.height} unoptimized loading="lazy" draggable="false"/>
    </a>;
   })}
  </div>
  <div className="website-slider-controls">
   <button type="button" onClick={()=>step(-1)} aria-label={t.websitePrevious}><svg className="directional" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>
   <span className="website-slider-caption" aria-live="polite" aria-atomic="true"><bdi>{websites[active].domain}</bdi><small>{String(active+1).padStart(2,'0')} / 03</small></span>
   <button type="button" onClick={()=>step(1)} aria-label={t.websiteNext}><svg className="directional" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>
  </div>
 </div>;
}
