import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import GoogleIcon from '@/components/GoogleIcon';
import LanguagePicker from '@/components/LanguagePicker';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useT();
  const start = () => {
    const session = getSession();
    if (isAuthenticated) navigate(session?.onboarding_complete ? '/dashboard' : '/onboarding/name');
    else base44.auth.loginWithProvider('google', `${window.location.origin}/onboarding/name`);
  };
  return <MobileShell><div className="min-h-[680px] flex flex-col bg-white">
    <div className="bg-[#183b3b] text-white px-7 pt-12 pb-10 rounded-b-[2.5rem] relative">
      <div className="absolute right-4 top-4"><LanguagePicker dark /></div>
      <p className="text-[#7dd4d4] text-xs font-black tracking-[.2em]">SPARKYDOLLAR</p>
      <h1 className="text-4xl font-black leading-tight mt-5">{t('landing.headline')}</h1>
      <p className="text-white/70 mt-4 leading-6">{t('landing.sub')}</p>
      <div className="mt-7"><SparkyAvatar size={110} expression="happy"/></div>
    </div>
    <div className="p-7 flex-1 flex flex-col justify-center">
      <button onClick={start} className="w-full border border-gray-200 rounded-full py-3.5 font-bold text-[#183b3b] flex items-center justify-center gap-3 shadow-sm"><GoogleIcon/>{t('landing.google')}</button>
      <p className="text-center text-xs text-gray-400 mt-4">{t('landing.signin')}</p>
    </div>
    <footer className="px-7 pb-7 text-center text-xs text-gray-400">{t('landing.footer')} · <Link className="underline" to="/privacy">{t('landing.privacy')}</Link> · <Link className="underline" to="/terms">{t('landing.terms')}</Link></footer>
  </div></MobileShell>;
}