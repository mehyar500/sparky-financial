import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import ExploreDetail from '@/components/results/ExploreDetail';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActiveRecSet, startPath } from '@/lib/pathData';
import { generateExploreDetail } from '@/lib/sparkyAI';

export default function ExploreOption() {
  const navigate = useNavigate();
  const num = new URLSearchParams(window.location.search).get('opt') === '2' ? 2 : 1;
  const [state, setState] = useState({ loading: true, option: null, recSet: null, profile: null });
  const [choosing, setChoosing] = useState(false);

  useEffect(() => { (async () => {
    setState(s => ({ ...s, loading: true }));
    const [profile, recSet] = await Promise.all([getMyProfile(), getActiveRecSet()]);
    if (!recSet) { navigate('/results'); return; }
    const key = num === 1 ? 'option_1_json' : 'option_2_json';
    let option = recSet[key] || {};
    if (!option.likely_challenges) {
      const detail = await generateExploreDetail(option, profile);
      option = { ...option, ...detail };
      await base44.entities.RecommendationSet.update(recSet.id, { [key]: option });
    }
    setState({ loading: false, option, recSet, profile });
  })(); }, [num]);

  const choose = async () => {
    setChoosing(true);
    await startPath(state.recSet, state.option, state.profile);
    navigate('/dashboard');
  };

  if (state.loading || choosing) return <MobileShell><div className="min-h-[680px] flex flex-col items-center justify-center bg-[#183b3b] text-white p-8 text-center"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/><p className="font-bold mt-4">{choosing ? 'Building your personalized action plan...' : 'Getting the full picture...'}</p></div></MobileShell>;

  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <ExploreDetail option={state.option}/>
    <div className="px-5 space-y-3 mt-2">
      <button onClick={choose} className="w-full bg-[#5BC8C8] text-white rounded-full py-3.5 font-bold">Choose This Path</button>
      <button onClick={() => navigate(`/explore?opt=${num === 1 ? 2 : 1}`)} className="w-full border border-[#5BC8C8] text-[#287c7c] rounded-full py-3 font-bold text-sm">See the Other Option</button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/compare')} className="border border-gray-300 text-gray-600 rounded-full py-3 font-bold text-xs">Compare Both Options</button>
        <button onClick={() => navigate('/different-options')} className="border border-gray-300 text-gray-600 rounded-full py-3 font-bold text-xs">Show Me Different Options</button>
      </div>
    </div>
  </div></MobileShell>;
}