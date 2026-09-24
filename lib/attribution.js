// Attribution is session-scoped, optional and collected only after analytics consent.
export function attribution(){
 try{return JSON.parse(sessionStorage.getItem('creovo.attribution')||'{}');}catch{return {};}
}
export function captureAttribution(){
 try{
  if(localStorage.getItem('creovo.analytics')!=='granted')return;
  const previous=attribution(),params=new URLSearchParams(location.search);
  if(!previous.landing_page){
   previous.landing_page=location.pathname;
   previous.language=document.documentElement.lang;
   if(document.referrer)previous.referrer_host=new URL(document.referrer).hostname;
   for(const key of ['utm_source','utm_medium','utm_campaign']){const value=params.get(key);if(value&&/^[a-zA-Z0-9_ .-]{1,100}$/.test(value))previous[key]=value;}
  }
  if(location.pathname.includes('/services/'))previous.last_service=location.pathname;
  sessionStorage.setItem('creovo.attribution',JSON.stringify(previous));
 }catch{}
}
