import { accountStorageKey } from '@/lib/accountStorage';
const supported = ['en', 'es', 'pt'];
const KEY = 'firstdollar_lang';
let resolvedLanguage;
export function detectLanguage() {
  return (navigator.languages || [navigator.language]).map(code => (code || '').slice(0, 2).toLowerCase()).find(code => supported.includes(code)) || 'en';
}
export function getPreference() { const key = accountStorageKey(KEY); const saved = key ? localStorage.getItem(key) : null; return supported.includes(saved) ? saved : 'auto'; }
export function resolveLanguage(preference) { return supported.includes(preference) ? preference : detectLanguage(); }
export function getLang() { return resolvedLanguage || resolveLanguage(getPreference()); }
export function rememberLanguage(preference) {
  const key = accountStorageKey(KEY);
  if (key) localStorage.setItem(key, preference);
  resolvedLanguage = resolveLanguage(preference);
  document.documentElement.lang = resolvedLanguage;
  return resolvedLanguage;
}