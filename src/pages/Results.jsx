import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Loader2, Lock } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import PaywallCTA from '@/components/results/PaywallCTA';
import { base44 } from '@/api/base44Client';
import { startCheckout } from '@/lib/checkout';
import { generateOptions } from '@/lib/sparkyAI';
import { getMyProfile, getActiveRecSet } from '@/lib/pathData';
import { useT } from '@/lib/i18n';

export default function Results() {
  const navigate = useNavigate();
  const { t } = useT();
  const [recSet, setRecSet] = useState(null), [profile, setProfile] = useState(null), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [attempt, setAttempt] = useState(0);

  useEffect(() => { (async () => {
    setLoading(true); setError('');
    try {
    let [p, r] = await Promise.all([getMyProfile(), getActiveRecSet()]);
    if (!p) { navigate('/onboarding/name', { replace: true }); return; }
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId && p && !p.is_paid) {
      const res = await base44.functions.invoke('verifyCheckout', { sessionId, profileId: p.id });
      if (res.data.paid) p = { ...p, is_paid: true };
    }
    if (!r) {
      const options = await generateOptions(p);
      r = await base44.entities.RecommendationSet.create({ option_1_json: options.option_1, option_2_json: options.option_2, rejected_options: [], date_generated: new Date().toISOString(), status: 'active' });
    }
    setProfile(p); setRecSet(r);
    } catch (e) { setError(e.message || t('processing.error')); }
    finally { setLoading(false); }
  })(); }, [attempt]);

  if (loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  if (error) return <MobileShell><div className="min-h-[680px] flex flex-col items-center justify-center p-6 text-center"><p role="alert" className="text-destructive">{error}</p><button onClick={() => setAttempt(n => n + 1)} className="mt-4 rounded-full bg-launch-mint px-6 py-3 font-bold text-launch-ink">{t('processing.retry')}</button></div></MobileShell>;

  const isPaid = profile?.is_paid;
  const opt1 = recSet?.option_1_json || {}, opt2 = recSet?.option_2_json || {};
  const open = num => isPaid ? navigate(`/explore?opt=${num}`) : startCheckout(profile?.id);

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#183b3b]">
      <WaveHeader height={95}>
        <p className="text-[#1e5555] font-bold text-sm text-center leading-snug whitespace-pre-line">{t('results.header')}</p>
      </WaveHeader>

      {/* Top half — Option 1 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        <p className="text-white font-black text-2xl leading-tight">💡 {opt1.title}</p>
        <ChevronUp className="text-[#5BC8C8] mt-3" size={22}/>
        <button onClick={() => open(1)} className="mt-2 bg-[#5BC8C8] text-[#183b3b] font-bold rounded-full px-12 py-3 text-sm hover:bg-[#7dd4d4] transition-colors">{t('common.option', { n: 1 })}</button>
      </div>

      {/* Divider / lock */}
      <div className="flex items-center gap-3 px-8">
        <div className="flex-1 h-px bg-white/20"/>
        {!isPaid && <button onClick={() => startCheckout(profile?.id)} aria-label={t('results.unlock')}><Lock className="text-[#5BC8C8]" size={20}/></button>}
        <div className="flex-1 h-px bg-white/20"/>
      </div>

      {/* Bottom half — Option 2 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
        <button onClick={() => open(2)} className="bg-[#5BC8C8] text-[#183b3b] font-bold rounded-full px-12 py-3 text-sm hover:bg-[#7dd4d4] transition-colors">{t('common.option', { n: 2 })}</button>
        <ChevronDown className="text-[#5BC8C8] mt-2" size={22}/>
        <p className="text-white font-black text-2xl leading-tight mt-3">💡 {opt2.title}</p>
      </div>

      {!isPaid && <div className="px-5 pb-6"><PaywallCTA profileId={profile?.id}/></div>}
    </div>
  </MobileShell>;
}