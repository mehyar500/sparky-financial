import React from 'react';
import { HOME_HREF, APP_HREF } from '@/components/launch/launchDomains';
import { Sparkles } from 'lucide-react';
import { useT, LANGUAGES } from '@/lib/i18n';

export default function LaunchNav({ copy, launched }) {
  const { lang, setLang } = useT();
  return <header className="mx-auto max-w-7xl px-5 md:px-10 py-6 flex items-center justify-between gap-3">
    <a href={HOME_HREF} className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tight text-launch-paper" aria-label="SparkyDollar"><Sparkles size={24} className="text-launch-mint" aria-hidden="true"/>Sparky<span className="text-launch-mint -ml-2">Dollar</span></a>
    <nav className="hidden md:flex gap-8 text-sm font-semibold text-launch-soft"><a href="#how-it-works" className="hover:text-launch-paper">{copy.how}</a><a href="#preview" className="hover:text-launch-paper">{copy.preview}</a></nav>
    <div className="flex gap-3 items-center"><select aria-label="Language" value={lang} onChange={e => setLang(e.target.value)} className="bg-launch-night text-launch-paper text-xs rounded-lg p-2 min-h-11 border border-launch-mint/30">{LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}</select><a href={launched ? APP_HREF : '#waitlist'} className="hidden sm:inline-flex launch-button text-sm">{launched ? copy.open : copy.join}</a></div>
  </header>;
}