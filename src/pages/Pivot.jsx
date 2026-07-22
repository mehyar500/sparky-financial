import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getActivePath, touchPath, getActiveRecSet } from '@/lib/pathData';

const REASONS = ['Too stressful', 'Did not fit my schedule', 'Too much social interaction', 'Too physically demanding', 'Startup cost was too high', 'Income potential felt too low', 'Local demand was weak', 'I lost interest', 'Other'];

export default function Pivot() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const act = async action => {
    const path = await getActivePath();
    if (path && reason) await touchPath(path.id, { user_notes: `${path.user_notes ? path.user_notes + '\n' : ''}Pivot feedback: ${reason}` });
    if (action === 'pause') { if (path) await touchPath(path.id, { status: 'paused', reason_paused: reason || 'Taking a break' }); navigate('/paths'); }
    if (action === 'adjust') navigate('/dashboard');
    if (action === 'other') {
      const recSet = await getActiveRecSet();
      const selected = await base44.entities.RecommendationSet.filter({ status: 'selected' }, '-created_date', 1);
      const set = recSet || selected[0];
      if (set) {
        if (path) await touchPath(path.id, { status: 'paused', reason_paused: reason || 'Exploring the other saved option' });
        const chosenTitle = path?.selected_option_json?.title;
        navigate(`/explore?opt=${set.option_1_json?.title === chosenTitle ? 2 : 1}`);
      } else navigate('/different-options');
    }
    if (action === 'new') { navigate('/different-options'); }
  };

  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <div className="bg-[#183b3b] text-white px-5 pt-8 pb-6 rounded-b-3xl">
      <h1 className="text-2xl font-black">What felt difficult about this path?</h1>
      <p className="text-white/60 text-sm mt-1">Trying this taught us something useful. Nothing gets deleted.</p>
    </div>
    <div className="p-4">
      <div className="flex flex-wrap gap-2">{REASONS.map(r => <button key={r} onClick={() => setReason(r)} className={`text-xs font-bold rounded-full px-3.5 py-2.5 border ${reason === r ? 'bg-[#5BC8C8] text-white border-[#5BC8C8]' : 'bg-white text-gray-600 border-gray-200'}`}>{r}</button>)}</div>
      <div className="space-y-3 mt-5">
        <button onClick={() => act('adjust')} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left font-bold text-sm text-[#183b3b]">Adjust This Plan<span className="block text-xs text-gray-400 font-semibold mt-0.5">Keep going — ask Sparky to make the next step smaller.</span></button>
        <button onClick={() => act('pause')} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left font-bold text-sm text-[#183b3b]">Pause This Path<span className="block text-xs text-gray-400 font-semibold mt-0.5">Your progress stays saved for later.</span></button>
        <button onClick={() => act('other')} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left font-bold text-sm text-[#183b3b]">Explore My Other Saved Option<span className="block text-xs text-gray-400 font-semibold mt-0.5">Look at the second path Sparky found for you.</span></button>
        <button onClick={() => act('new')} className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left font-bold text-sm text-[#183b3b]">Generate Two New Options<span className="block text-xs text-gray-400 font-semibold mt-0.5">Tell Sparky what to change and get fresh ideas.</span></button>
      </div>
      <button onClick={() => navigate('/dashboard')} className="w-full text-gray-500 text-sm font-bold py-4">Back to my plan</button>
    </div>
  </div></MobileShell>;
}