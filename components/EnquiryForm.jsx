'use client';
import { useEffect,useState } from 'react';
import { ui,localePath } from '../content/ui.mjs';
import { track } from '../lib/analytics';
export default function EnquiryForm({locale,options}) {
 const t=ui[locale], [state,setState]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{const form=document.querySelector('#project-enquiry'),requested=new URLSearchParams(location.search).get('service');if(requested&&options.some(o=>o.value===requested))form.elements.service.value=requested;},[options]);
 const validate=e=>{const f=e.target;f.setCustomValidity('');if(f.validity.valueMissing)f.setCustomValidity(f.type==='checkbox'?t.consentError:t.required);else if(f.validity.typeMismatch)f.setCustomValidity(t.invalidEmail);else if(f.validity.tooLong)f.setCustomValidity(t.tooLong);};
 async function submit(e){e.preventDefault();if(busy)return;const form=e.currentTarget,data=new FormData(form);data.append('_subject','New Creovo Media project enquiry');data.append('source_page',location.origin+location.pathname);data.append('language',locale);const params=new URLSearchParams(location.search);for(const key of ['utm_source','utm_medium','utm_campaign']){const v=params.get(key);if(v)data.append(key,v.slice(0,120));}setBusy(true);setState(t.sending);try{const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!response.ok)throw new Error('submission');track('generate_lead',{service:data.get('service')});form.reset();setState(t.sent);}catch{setState(t.failed);}finally{setBusy(false);}}
 return <form id="project-enquiry" className="brief-form" action="https://formspree.io/f/xjygvbbv" method="POST" onSubmit={submit} onInvalid={validate} onInput={e=>e.target.setCustomValidity?.('')}>
  <label>{t.name}<input name="name" autoComplete="name" required maxLength={100} placeholder={t.namePlaceholder}/></label><label>{t.company}<input name="company" autoComplete="organization" maxLength={150} placeholder={t.companyPlaceholder}/></label>
  <label>{t.email}<input name="email" type="email" autoComplete="email" required dir="ltr" placeholder={t.emailPlaceholder}/></label><label>{t.service}<select name="service" required>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
  <label className="full">{t.timing}<input name="timing" maxLength={150} placeholder={t.timingPlaceholder}/></label><label className="full">{t.message}<textarea name="message" required maxLength={3000} rows={5} placeholder={t.messagePlaceholder}/></label>
  <input type="hidden" name="_gotcha" value="" readOnly/><label className="consent full"><input type="checkbox" name="consent" required/>{t.consent}</label><button className="page-button" type="submit" disabled={busy} aria-busy={busy}>{busy?t.sending:t.send}</button><p className="form-message" role="status">{state}</p><a className="form-privacy full" href={localePath('/privacy/',locale)}>{t.formNote}</a>
 </form>;
}
