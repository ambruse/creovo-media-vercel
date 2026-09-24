import {attribution} from './attribution';
export function track(name, properties={}) {
 if(typeof window==='undefined')return;
 try { if(localStorage.getItem('creovo.analytics')!=='granted')return; }catch{return;}
 if(typeof window.gtag==='function')window.gtag('event',name,{...attribution(),page_path:location.pathname,language:document.documentElement.lang,...properties});
}
