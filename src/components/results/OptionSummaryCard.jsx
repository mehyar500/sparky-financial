import React from 'react';
import { Lock } from 'lucide-react';
import { EARNINGS_DISCLAIMER } from '@/lib/sparkyAI';

export default function OptionSummaryCard({ option = {}, num, onExplore, locked }) {
  return (
    <div className="bg-white rounded-3xl p-5 text-[#183b3b] shadow-sm">
      <p className="text-[10px] font-black text-[#399d9d] uppercase tracking-wider">Option {num}</p>
      <h2 className="font-black text-xl mt-1">{option.title}</h2>
      <p className="text-sm text-gray-600 mt-2">{option.one_sentence_description}</p>
      <div className="mt-3 space-y-1.5 text-xs">
        <p><span className="font-bold text-[#399d9d]">Starter income estimate:</span> {option.realistic_starter_income_range}</p>
        <p><span className="font-bold text-[#399d9d]">Likely time to begin:</span> {option.estimated_time_to_launch}</p>
      </div>
      <div className="bg-teal-50 rounded-xl p-3 mt-3">
        <p className="text-xs text-[#287c7c]"><span className="font-bold">Why Sparky picked this:</span> {option.why_this_fits_user}</p>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 italic">{EARNINGS_DISCLAIMER}</p>
      <button onClick={onExplore} className={`w-full rounded-full py-3 font-bold mt-4 flex items-center justify-center gap-2 ${locked ? 'bg-gray-100 text-gray-400' : 'bg-[#5BC8C8] text-white'}`}>
        {locked && <Lock size={14}/>}Explore Option {num}
      </button>
    </div>
  );
}