import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import OptionSummaryCard from '@/components/results/OptionSummaryCard';
import PaywallCTA from '@/components/results/PaywallCTA';
import { base44 } from '@/api/base44Client';
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
  const explore = num => isPaid ? navigate(`/explore?opt=${num}`) : null;
  return <MobileShell><div className="min-h-[680px] bg-[#183b3b] p-5 pb-8">
    <p className="text-[#7dd4d4] text-xs font-bold uppercase tracking-wider">Your two paths</p>
    <h1 className="text-white text-3xl font-black mt-2">Here's what Sparky found for you.</h1>
    <div className="space-y-4 mt-6">
      <OptionSummaryCard option={recSet?.option_1_json} num={1} onExplore={() => explore(1)} locked={!isPaid}/>
      <OptionSummaryCard option={recSet?.option_2_json} num={2} onExplore={() => explore(2)} locked={!isPaid}/>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-5">
      <button onClick={() => isPaid ? navigate('/compare') : null} disabled={!isPaid} className={`rounded-full py-3 text-sm font-bold border border-white/30 text-white ${!isPaid ? 'opacity-50' : ''}`}>Compare Both</button>
      <button onClick={() => navigate('/different-options')} className="rounded-full py-3 text-sm font-bold border border-white/30 text-white">I Want Different Options</button>
    </div>
    {!isPaid && <PaywallCTA profileId={profile?.id}/>}
  </div></MobileShell>;
}