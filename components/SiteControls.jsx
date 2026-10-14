'use client';
import { useEffect } from 'react';
import { track } from '../lib/analytics';
import {captureAttribution} from '../lib/attribution';
export default function SiteControls({locale}) {
 useEffect(()=>{
  captureAttribution();
  try{localStorage.setItem('creovo.locale',locale);}catch{}
  const nav=document.querySelector('.nav-shell'),hero=document.querySelector('.hero-title'),menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#menu-toggle'),close=menu?.querySelector('.menu-close');
  const scroll=()=>{nav?.classList.toggle('scrolled',scrollY>50);nav?.classList.toggle('logo-visible',!hero||hero.getBoundingClientRect().bottom<=120);};
  const open=()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');};
  const dismiss=()=>menu.close(); const onClose=()=>toggle.setAttribute('aria-expanded','false');
  toggle?.addEventListener('click',open);close?.addEventListener('click',dismiss);menu?.addEventListener('close',onClose);addEventListener('scroll',scroll,{passive:true});scroll();
  const ga='G-K55JL8J8LF';
  const loadAnalytics=()=>{if(!/^G-[A-Z0-9]+$/.test(ga||'')||window.gtag)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',ga,{page_location:location.origin+location.pathname,send_page_view:true});const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${ga}`;document.head.appendChild(script);};
  loadAnalytics();
  const click=e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('tel:'))track('phone_click');if(href.startsWith('mailto:'))track('email_click');if(href.startsWith('https://wa.me/97472357755'))track('whatsapp_click');if(a.dataset.portfolioService)track('portfolio_to_service_click',{service:a.dataset.portfolioService,source_path:location.pathname});if(href.includes('/contact/')){const service=new URL(a.href).searchParams.get('service');track(service?'service_cta_click':'contact_cta_click',{source_path:location.pathname,...(service?{service}:{})});}};document.addEventListener('click',click);
  return()=>{toggle?.removeEventListener('click',open);close?.removeEventListener('click',dismiss);menu?.removeEventListener('close',onClose);removeEventListener('scroll',scroll);document.removeEventListener('click',click);};
 },[locale]);
 return null;
}
