import React from 'react';

export default function PathHeader({ path = {} }) {
  const option = path.selected_option_json || {};
  const goal = path.first_goal_amount || 100;
  const earned = path.income_total || 0;
  const pct = Math.min(100, Math.round(earned / goal * 100));
  return (
    <div className="bg-[#183b3b] text-white px-5 pt-2 pb-6 rounded-b-3xl">
      <p className="text-[#7dd4d4] text-[10px] font-black uppercase tracking-widest">Current Path</p>
      <h1 className="text-2xl font-black mt-1">{option.title}</h1>
      <p className="text-white/60 text-xs mt-1">{path.first_goal}</p>
      <div className="mt-4">
        <div className="flex justify-between text-xs font-bold"><span>${earned} earned</span><span className="text-white/60">${goal} goal</span></div>
        <div className="h-2.5 bg-white/15 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#5BC8C8] rounded-full transition-all" style={{ width: `${pct}%` }}/></div>
      </div>
    </div>
  );
}