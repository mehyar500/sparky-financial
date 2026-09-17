import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useResumeApp from '@/components/auth/useResumeApp';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import GoogleIcon from '@/components/GoogleIcon';
import LanguagePicker from '@/components/LanguagePicker';
import { useT } from '@/lib/i18n';

export default function Landing() {
  const { t } = useT();
  const { start, loading, error } = useResumeApp();
  return <MobileShell><div className="min-h-[680px] flex flex-col bg-white">
    <div className="bg-launch-night text-launch-paper px-6 pt-4 pb-8 rounded-b-3xl">
      <div className="mb-5 flex justify-end"><LanguagePicker dark /></div>
      <p className="text-[#7dd4d4] text-xs font-black tracking-[.2em]">SPARKYDOLLAR</p>
      <h1 className="text-4xl font-black leading-tight mt-5">{t('landing.headline')}</h1>
      <p className="text-white/70 mt-4 leading-6">{t('landing.sub')}</p>
      <div className="mt-7"><SparkyAvatar size={110} expression="happy"/></div>
    </div>
    <div className="p-7 flex-1 flex flex-col justify-center">
      <button onClick={start} disabled={loading} className="w-full border border-border rounded-full py-3.5 font-bold text-launch-ink flex items-center justify-center gap-3 disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={20}/> : <GoogleIcon/>}{loading ? t('dash.thinking') : t('landing.google')}</button>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <p className="text-center text-xs text-muted-foreground mt-4">{t('landing.signin')}</p>
    </div>
    <footer className="px-7 pb-7 text-center text-xs text-muted-foreground">{t('landing.footer')} · <Link className="underline" to="/privacy">{t('landing.privacy')}</Link> · <Link className="underline" to="/terms">{t('landing.terms')}</Link></footer>
  </div></MobileShell>;
}