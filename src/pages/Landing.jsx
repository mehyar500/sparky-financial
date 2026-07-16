import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import GoogleIcon from '@/components/GoogleIcon';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getSession } from '@/lib/onboardingState';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const start = () => {
    const session = getSession();
    if (isAuthenticated) navigate(session?.onboarding_complete ? '/dashboard' : '/onboarding/name');
    else base44.auth.loginWithProvider('google', `${window.location.origin}/onboarding/name`);
  };
  return <MobileShell><div className="min-h-[680px] flex flex-col bg-white">
    <div className="bg-[#183b3b] text-white px-7 pt-12 pb-10 rounded-b-[2.5rem]">
      <p className="text-[#7dd4d4] text-xs font-black tracking-[.2em]">FIRSTDOLLAR</p>
      <h1 className="text-4xl font-black leading-tight mt-5">Your plan to your first $100.</h1>
      <p className="text-white/70 mt-4 leading-6">Pick a realistic path. Follow clear tasks. Track every dollar. Then keep going.</p>
      <div className="mt-7"><SparkyAvatar size={110} expression="happy"/></div>
    </div>
    <div className="p-7 flex-1 flex flex-col justify-center">
      <button onClick={start} className="w-full border border-gray-200 rounded-full py-3.5 font-bold text-[#183b3b] flex items-center justify-center gap-3 shadow-sm"><GoogleIcon/>Continue with Google</button>
      <p className="text-center text-xs text-gray-400 mt-4">Sign in to save your plan and progress.</p>
    </div>
    <footer className="px-7 pb-7 text-center text-xs text-gray-400">A StringFlix product · <Link className="underline" to="/privacy">Privacy</Link> · <Link className="underline" to="/terms">Terms</Link></footer>
  </div></MobileShell>;
}