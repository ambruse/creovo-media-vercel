import { localePath } from '../content/ui.mjs';

// Preserve only a known service choice, never arbitrary query data or form values.
export function languageSwitchHref(route, locale, service, validServices) {
 const target = localePath(route, locale === 'en' ? 'ar' : 'en');
 return route === '/contact/' && validServices.includes(service)
  ? `${target}?${new URLSearchParams({service})}`
  : target;
}
