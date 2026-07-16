import React from 'react';
import { Target } from 'lucide-react';

export default function MissionCard({ session }) {
  const path = session.chosen_option || session.option1 || {};
  const earned = session.money_earned || 0;
  const goal = session.first_goal_amount || 100;
  const progress = Math.min(100, Math.round((earned / goal) * 100));
  return <section className="bg-[#183b3b] text-white px-5 pb-5 pt-3 rounded-b-3xl">
    <div className="flex items-center gap-2 text-[#7dd4d4] text-xs font-bold uppercase tracking-wider"><Target size={14}/> Your mission</div>
    <h1 className="text-xl font-black mt-2">{path.emoji || '⚡'} {path.title || 'Build your first income stream'}</h1>
    <div className="flex justify-between text-xs mt-4"><span>${earned} earned</span><span>${goal} goal</span></div>
    <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#5BC8C8]" style={{width:`${progress}%`}} /></div>
    <p className="text-xs text-white/70 mt-2">Next milestone: {earned < 25 ? 'First $25' : earned < 50 ? 'First $50' : 'First $100'}</p>
  </section>;
}