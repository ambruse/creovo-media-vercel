'use client';
import { useEffect, useState } from 'react';
import { languageSwitchHref } from '../lib/language-switch.mjs';

export default function LanguageSwitch({route, locale, validServices, className}) {
 const [service, setService] = useState(null);
 useEffect(() => {
  if (route !== '/contact/') return;
  const syncQuery = () => setService(new URLSearchParams(location.search).get('service'));
  const change = event => {
   if (event.target.matches('#project-enquiry select[name="service"]')) setService(event.target.value);
  };
  const reset = event => {
   if (event.target.id === 'project-enquiry') setService(null);
  };
  syncQuery();
  document.addEventListener('change', change);
  document.addEventListener('reset', reset);
  addEventListener('popstate', syncQuery);
  return () => {
   document.removeEventListener('change', change);
   document.removeEventListener('reset', reset);
   removeEventListener('popstate', syncQuery);
  };
 }, [route]);
 const targetLocale = locale === 'en' ? 'ar' : 'en';
 return <a className={className} data-language-switch="true"
  href={languageSwitchHref(route, locale, service, validServices)}
  lang={targetLocale} hrefLang={targetLocale}>{locale === 'en' ? 'العربية' : 'English'}</a>;
}
