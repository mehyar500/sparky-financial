import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const choices=['Write my listing','Help me price this','Improve my approach','Explain this step','Ask Sparky anything'];
export default function HelpPanel({ session }) {
  const [open,setOpen]=useState(false),[answer,setAnswer]=useState(''),[loading,setLoading]=useState(false);
  const ask=async(choice)=>{setLoading(true);const path=session.chosen_option||session.option1||{};const result=await base44.integrations.Core.InvokeLLM({prompt:`You are Sparky. Give a concise, specific, immediately usable answer for: ${choice}. User location: ${session.location}. Income path: ${path.title}. Current tasks: ${JSON.stringify(session.tasks||[])}. Avoid hype and buzzwords. Return 3 short actionable bullets.`});setAnswer(result);setLoading(false)};
  return <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <button onClick={()=>setOpen(!open)} className="w-full p-4 flex justify-between font-bold text-[#183b3b]">Need help?<ChevronDown size={18}/></button>
    {open&&<div className="px-4 pb-4"><div className="flex flex-wrap gap-2">{choices.map(c=><button key={c} onClick={()=>ask(c)} className="text-xs border border-[#5BC8C8] text-[#287c7c] rounded-full px-3 py-2">{c}</button>)}</div>{loading&&<Loader2 className="animate-spin text-[#5BC8C8] mt-4"/>}{answer&&<p className="text-sm whitespace-pre-line text-gray-600 bg-gray-50 rounded-xl p-3 mt-4">{answer}</p>}</div>}
  </section>;
}