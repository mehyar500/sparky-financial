import React, { createContext, useContext, useState } from 'react';
import en from '@/lib/translations/en';
import es from '@/lib/translations/es';
import pt from '@/lib/translations/pt';

const DICTS = { en, es, pt };
export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'pt', label: 'PT', name: 'Português' },
];
export const LANGUAGE_NAMES = { en: 'English', es: 'Spanish', pt: 'Portuguese' };
const KEY = 'firstdollar_lang';

export function getLang() {
  const saved = localStorage.getItem(KEY);
  if (saved && DICTS[saved]) return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return DICTS[browser] ? browser : 'en';
}

export function translate(lang, key, vars = {}) {
  let str = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replaceAll(`{${k}}`, v); });
  return str;
}

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k, v) => translate('en', k, v) });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getLang);
  const setLang = code => { localStorage.setItem(KEY, code); setLangState(code); };
  const t = (key, vars) => translate(lang, key, vars);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useT = () => useContext(LangContext);