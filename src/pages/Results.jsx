import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Loader2, Lock } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import PaywallCTA from '@/components/results/PaywallCTA';
import { base44 } from '@/api/base44Client';
import { startCheckout } from '@/lib/checkout';
import { getMyProfile, getActiveRecSet } from '@/lib/pathData';

export default function Results() {
  const navigate = useNavigate();
  const [recSet, setRecSet] = useState(null), [profile, setProfile] = useState(null), [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    let [p, r] = await Promise.all([getMyProfile(), getActiveRecSet()]);
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId && p && !p.is_paid) {
      const res = await base44.functions.invoke('verifyCheckout', { sessionId, profileId: p.id });
      if (res.data.paid) p = { ...p, is_paid: true };
    }
    setProfile(p); setRecSet(r); setLoading(false);
    if (!r) navigate('/onboarding/processing');
  })(); }, []);

  if (loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  const isPaid = profile?.is_paid;
  const opt1 = recSet?.option_1_json || {}, opt2 = recSet?.option_2_json || {};
  const open = num => isPaid ? navigate(`/explore?opt=${num}`) : startCheckout(profile?.id);

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#183b3b]">
      <WaveHeader height={95}>
        <p className="text-[#1e5555] font-bold text-sm text-center leading-snug">Let's explore all your choices<br/>before you choose one.</p>
      </WaveHeader>

      {/* Top half — Option 1 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        <p className="text-white font-black text-2xl leading-tight">{opt1.title}</p>
        <ChevronUp className="text-[#5BC8C8] mt-3" size={22}/>
        <button onClick={() => open(1)} className="mt-2 bg-[#5BC8C8] text-[#183b3b] font-bold rounded-full px-12 py-3 text-sm hover:bg-[#7dd4d4] transition-colors">Option 1</button>
      </div>

      {/* Divider / lock */}
      <div className="flex items-center gap-3 px-8">
        <div className="flex-1 h-px bg-white/20"/>
        {!isPaid && <button onClick={() => startCheckout(profile?.id)} aria-label="Unlock plans"><Lock className="text-[#5BC8C8]" size={20}/></button>}
        <div className="flex-1 h-px bg-white/20"/>
      </div>

      {/* Bottom half — Option 2 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        <button onClick={() => open(2)} className="bg-[#5BC8C8] text-[#183b3b] font-bold rounded-full px-12 py-3 text-sm hover:bg-[#7dd4d4] transition-colors">Option 2</button>
        <ChevronDown className="text-[#5BC8C8] mt-2" size={22}/>
        <p className="text-white font-black text-2xl leading-tight mt-3">{opt2.title}</p>
      </div>

      {!isPaid && <div className="px-5 pb-6"><PaywallCTA profileId={profile?.id}/></div>}
    </div>
  </MobileShell>;
}