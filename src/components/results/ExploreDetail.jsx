import React from 'react';
import { EARNINGS_DISCLAIMER } from '@/lib/sparkyAI';

const Row = ({ label, value }) => <div className="flex justify-between gap-3 py-2 border-b border-gray-100 last:border-0"><span className="text-xs font-bold text-gray-500">{label}</span><span className="text-xs font-bold text-[#183b3b] text-right">{value}</span></div>;
const List = ({ title, items, tone = 'gray' }) => !items?.length ? null : (
  <div className={`rounded-2xl p-4 mt-3 ${tone === 'amber' ? 'bg-amber-50' : 'bg-white'}`}>
    <p className={`text-xs font-black uppercase tracking-wider ${tone === 'amber' ? 'text-amber-700' : 'text-[#399d9d]'}`}>{title}</p>
    <ul className="mt-2 space-y-1.5">{items.map((x, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-[#5BC8C8]">•</span>{x}</li>)}</ul>
  </div>
);

export default function ExploreDetail({ option = {} }) {
  return <>
    <div className="bg-[#183b3b] text-white px-5 pt-8 pb-6 rounded-b-3xl">
      <h1 className="text-2xl font-black">{option.title}</h1>
      <p className="text-white/70 text-sm mt-2">{option.short_explanation || option.one_sentence_description}</p>
    </div>
    <div className="px-5 mt-4">
      <div className="bg-teal-50 rounded-2xl p-4"><p className="text-sm text-[#287c7c]"><span className="font-bold">Why this fits you:</span> {option.why_this_fits_user}</p></div>
      <div className="bg-white rounded-2xl p-4 mt-3">
        <Row label="Typical startup cost" value={option.estimated_startup_cost}/>
        <Row label="Likely time to start" value={option.estimated_time_to_launch}/>
        <Row label="Time to first income" value={option.estimated_time_to_first_income}/>
        <Row label="Starter income estimate" value={option.realistic_starter_income_range}/>
        <Row label="Difficulty" value={option.difficulty_level}/>
        <Row label="Social interaction" value={option.social_interaction_level}/>
        <Row label="Local or remote" value={option.remote_or_local}/>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 italic px-1">{EARNINGS_DISCLAIMER}</p>
      <List title="Likely challenges" items={option.likely_challenges}/>
      <List title="Safety & legal considerations" items={option.safety_legal_considerations || option.risks_or_requirements} tone="amber"/>
      <List title="Your first three steps" items={option.first_three_steps}/>
    </div>
  </>;
}