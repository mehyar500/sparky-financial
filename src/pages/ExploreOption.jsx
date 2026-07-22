import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActiveRecSet } from '@/lib/pathData';
import { generateExploreDetail } from '@/lib/sparkyAI';

export default function ExploreOption() {
  const navigate = useNavigate();
  const num = new URLSearchParams(window.location.search).get('opt') === '2' ? 2 : 1;
  const other = num === 1 ? 2 : 1;
  const [state, setState] = useState({ loading: true, option: null, detailLoading: false });

  useEffect(() => { (async () => {
    setState({ loading: true, option: null, detailLoading: false });
    const [profile, recSet] = await Promise.all([getMyProfile(), getActiveRecSet()]);
    if (!profile?.is_paid) { navigate('/results'); return; }
    if (!recSet) { navigate('/results'); return; }
    const key = num === 1 ? 'option_1_json' : 'option_2_json';
    const option = recSet[key] || {};
    if (option.likely_challenges) {
      setState({ loading: false, option, detailLoading: false });
    } else {
      setState({ loading: false, option, detailLoading: true });
      const detail = await generateExploreDetail(option, profile);
      const merged = { ...option, ...detail };
      await base44.entities.RecommendationSet.update(recSet.id, { [key]: merged });
      setState({ loading: false, option: merged, detailLoading: false });
    }
  })(); }, [num]);

  if (state.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  const o = state.option;

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#183b3b]">
      <WaveHeader height={65}/>
      <div className="flex flex-col flex-1 px-6 pt-5 pb-6 overflow-y-auto">
        <div className="text-center">
          <p className="text-[#5BC8C8] font-bold text-sm">Option {num}</p>
          <ChevronDown className="text-[#5BC8C8] mx-auto mt-0.5" size={18}/>
          <h1 className="text-white font-black text-3xl mt-1 leading-tight">{o.title}</h1>
        </div>

        <div className="mt-6 space-y-3 text-center text-sm">
          <p><span className="text-[#5BC8C8] font-bold">Typical Starter Income: </span><span className="text-white font-bold">{o.realistic_starter_income_range}</span></p>
          {num === 1
            ? <p><span className="text-[#5BC8C8] font-bold">Fastest Path: </span><span className="text-white font-bold">{o.estimated_time_to_first_income}</span></p>
            : <p><span className="text-[#5BC8C8] font-bold">Best For: </span><span className="text-white font-bold">{o.one_sentence_description}</span></p>}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[#5BC8C8] font-bold text-sm">Why Sparky picked this:</p>
          <p className="text-white italic text-sm leading-relaxed mt-2">"{o.why_this_fits_user}"</p>
        </div>

        {state.detailLoading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[#5BC8C8] text-xs font-semibold">
            <Loader2 className="animate-spin" size={14}/> Sparky is digging deeper...
          </div>
        )}
        {o.likely_challenges && (
          <div className="mt-6 bg-[#1e3535] rounded-2xl p-4 space-y-4 text-sm">
            {o.short_explanation && <p className="text-white/90 leading-relaxed">{o.short_explanation}</p>}
            <div>
              <p className="text-[#5BC8C8] font-bold mb-1.5">Likely challenges</p>
              {o.likely_challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <div className="w-2 h-2 rounded-sm bg-[#5BC8C8] mt-1.5 flex-shrink-0"/>
                  <p className="text-white/90">{c}</p>
                </div>
              ))}
            </div>
            {o.safety_legal_considerations && <div>
              <p className="text-[#5BC8C8] font-bold mb-1.5">Safety &amp; legal notes</p>
              {o.safety_legal_considerations.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <div className="w-2 h-2 rounded-sm bg-[#5BC8C8] mt-1.5 flex-shrink-0"/>
                  <p className="text-white/90">{c}</p>
                </div>
              ))}
            </div>}
          </div>
        )}

        <div className="mt-auto pt-6 space-y-3">
          <button onClick={() => navigate(`/explore?opt=${other}`)} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3.5 font-bold text-sm hover:bg-[#7dd4d4] transition-colors">See Option {other}</button>
          <button onClick={() => navigate('/time-to-pick')} className="w-full border border-[#5BC8C8] text-[#5BC8C8] rounded-full py-3.5 font-bold text-sm hover:bg-[#5BC8C8]/10 transition-colors">Back to Options Page</button>
        </div>
      </div>
    </div>
  </MobileShell>;
}