import React, { createContext, useContext } from 'react';
import useLanguagePreference from '@/components/language/useLanguagePreference';
import enhancements from '@/lib/translations/enhancements';
export { getLang } from '@/lib/languagePreference';
import en from '@/lib/translations/en';
import es from '@/lib/translations/es';
import pt from '@/lib/translations/pt';

const DICTS = { en: { ...en, ...enhancements.en }, es: { ...es, ...enhancements.es }, pt: { ...pt, ...enhancements.pt } };
export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'pt', label: 'PT', name: 'Português' },
];
export const LANGUAGE_NAMES = { en: 'English', es: 'Spanish', pt: 'Portuguese' };


export function translate(lang, key, vars = {}) {
  let str = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replaceAll(`{${k}}`, v); });
  return str;
}

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k, v) => translate('en', k, v) });

export function LanguageProvider({ children }) {
  const state = useLanguagePreference();
  const t = (key, vars) => translate(state.lang, key, vars);
  return <LangContext.Provider value={{ ...state, t }}>{children}</LangContext.Provider>;
}

export const useT = () => useContext(LangContext);