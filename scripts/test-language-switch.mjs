import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../content/services.mjs';
import { languageSwitchHref } from '../lib/language-switch.mjs';
const slugs = services.map(s => s.slug);

test('every service survives both language directions', () => {
 for (const service of slugs) {
  assert.equal(languageSwitchHref('/contact/', 'en', service, slugs), `/ar/contact/?service=${service}`);
  assert.equal(languageSwitchHref('/contact/', 'ar', service, slugs), `/contact/?service=${service}`);
 }
});
test('unknown or injected selections cannot carry parameters to the other language', () => {
 for (const service of [null, '', 'unknown', 'seo&email=private@example.com', '//example.com', '../seo']) {
  assert.equal(languageSwitchHref('/contact/', 'en', service, slugs), '/ar/contact/');
  assert.equal(languageSwitchHref('/contact/', 'ar', service, slugs), '/contact/');
 }
});
test('non-contact pages keep their equivalent path without a service parameter', () => {
 for (const route of ['/', '/services/seo/', '/work/arg-1/']) {
  assert.equal(languageSwitchHref(route, 'en', 'seo', slugs), `/ar${route}`);
  assert.equal(languageSwitchHref(route, 'ar', 'seo', slugs), route);
 }
});
