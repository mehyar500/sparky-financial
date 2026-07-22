import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { getActiveRecSet } from '@/lib/pathData';
import { EARNINGS_DISCLAIMER } from '@/lib/sparkyAI';

const FIELDS = [
  ['realistic_starter_income_range', 'Starter income estimate'],
  ['estimated_startup_cost', 'Startup cost'],
  ['estimated_time_to_launch', 'Time to launch'],
  ['estimated_time_to_first_income', 'Time to first income'],
  ['difficulty_level', 'Difficulty'],
  ['social_interaction_level', 'Social interaction'],
  ['remote_or_local', 'Local or remote'],
  ['first_goal', 'First goal']
];

export default function CompareOptions() {
  const navigate = useNavigate();
  const [recSet, setRecSet] = useState(null);
  useEffect(() => { getActiveRecSet().then(r => { if (!r) navigate('/results'); else setRecSet(r); }); }, []);
  if (!recSet) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;
  const o1 = recSet.option_1_json || {}, o2 = recSet.option_2_json || {};
  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <div className="bg-[#183b3b] text-white px-5 pt-8 pb-6 rounded-b-3xl"><h1 className="text-2xl font-black">Side by side.</h1><p className="text-white/60 text-sm mt-1">Both are real options — pick the one that fits your life.</p></div>
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[o1, o2].map((o, i) => <button key={i} onClick={() => navigate(`/explore?opt=${i + 1}`)} className="bg-white rounded-2xl p-3 text-left"><p className="text-[10px] font-black text-[#399d9d]">OPTION {i + 1}</p><p className="font-black text-sm text-[#183b3b] mt-1">{o.title}</p></button>)}
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {FIELDS.map(([key, label]) => <div key={key} className="border-b border-gray-100 last:border-0 p-3"><p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</p><div className="grid grid-cols-2 gap-2 mt-1.5"><p className="text-xs font-bold text-[#183b3b]">{o1[key]}</p><p className="text-xs font-bold text-[#183b3b]">{o2[key]}</p></div></div>)}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 italic">{EARNINGS_DISCLAIMER}</p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={() => navigate('/explore?opt=1')} className="bg-[#5BC8C8] text-white rounded-full py-3 font-bold text-sm">Explore Option 1</button>
        <button onClick={() => navigate('/explore?opt=2')} className="bg-[#5BC8C8] text-white rounded-full py-3 font-bold text-sm">Explore Option 2</button>
      </div>
      <button onClick={() => navigate('/different-options')} className="w-full border border-gray-300 text-gray-600 rounded-full py-3 font-bold text-sm mt-3">I Want Different Options</button>
    </div>
  </div></MobileShell>;
}