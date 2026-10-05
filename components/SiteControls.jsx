'use client';
import { useEffect,useRef,useState } from 'react';
import { ui } from '../content/ui.mjs';
import { track } from '../lib/analytics';
import {captureAttribution} from '../lib/attribution';
export default function SiteControls({locale}) {
 const t=ui[locale],[show,setShow]=useState(false),dialog=useRef(null);
 useEffect(()=>{
  captureAttribution();
  try{localStorage.setItem('creovo.locale',locale);}catch{}
  const nav=document.querySelector('.nav-shell'),hero=document.querySelector('.hero-title'),menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#menu-toggle'),close=menu?.querySelector('.menu-close');
  const scroll=()=>{nav?.classList.toggle('scrolled',scrollY>50);nav?.classList.toggle('logo-visible',!hero||hero.getBoundingClientRect().bottom<=120);};
  const open=()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');};
  const dismiss=()=>menu.close(); const onClose=()=>toggle.setAttribute('aria-expanded','false');
  toggle?.addEventListener('click',open);close?.addEventListener('click',dismiss);menu?.addEventListener('close',onClose);addEventListener('scroll',scroll,{passive:true});scroll();
  const settings=()=>setShow(true);document.querySelector('[data-cookie-settings]')?.addEventListener('click',settings);
  const ga=process.env.NEXT_PUBLIC_GA4_ID;
  const loadAnalytics=()=>{if(!/^G-[A-Z0-9]+$/.test(ga||'')||window.gtag)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',ga,{page_location:location.origin+location.pathname,send_page_view:true});const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${ga}`;document.head.appendChild(script);};
  try{const consent=localStorage.getItem('creovo.analytics');if(consent==='granted')loadAnalytics();else if(!consent&&ga)setShow(true);}catch{}
  const consentChange=()=>{try{const granted=localStorage.getItem('creovo.analytics')==='granted';if(ga)window[`ga-disable-${ga}`]=!granted;if(granted){if(window.gtag)window.gtag('consent','update',{analytics_storage:'granted'});loadAnalytics();}else if(window.gtag)window.gtag('consent','update',{analytics_storage:'denied'});}catch{}};
  addEventListener('creovo-consent',consentChange);
  const click=e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('tel:'))track('phone_click');if(href.startsWith('mailto:'))track('email_click');if(a.dataset.portfolioService)track('portfolio_to_service_click',{service:a.dataset.portfolioService,source_path:location.pathname});if(href.includes('/contact/')){const service=new URL(a.href).searchParams.get('service');track(service?'service_cta_click':'contact_cta_click',{source_path:location.pathname,...(service?{service}:{})});}};document.addEventListener('click',click);
  return()=>{toggle?.removeEventListener('click',open);close?.removeEventListener('click',dismiss);menu?.removeEventListener('close',onClose);removeEventListener('scroll',scroll);document.querySelector('[data-cookie-settings]')?.removeEventListener('click',settings);removeEventListener('creovo-consent',consentChange);document.removeEventListener('click',click);};
 },[locale]);
 useEffect(()=>{if(show)dialog.current?.showModal();else dialog.current?.close();},[show]);
 function consent(value){try{localStorage.setItem('creovo.analytics',value);if(value==='denied')sessionStorage.removeItem('creovo.attribution');}catch{}captureAttribution();dispatchEvent(new Event('creovo-consent'));setShow(false);}
 return <dialog className="cookie-dialog" ref={dialog} onClose={()=>setShow(false)} aria-label={t.cookies}><h2>{t.cookies}</h2><p>{t.cookieText}</p><div className="button-row"><button className="page-button" onClick={()=>consent('granted')}>{t.accept}</button><button className="line-link" onClick={()=>consent('denied')}>{t.decline}</button></div></dialog>;
}
