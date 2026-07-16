import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getSession } from '@/lib/onboardingState';

async function upgrade(profileId){
  if(window.self!==window.top){alert('Checkout works from the published app. Open FirstDollar in a new tab to continue.');return;}
  const response=await base44.functions.invoke('createCheckout',{origin:window.location.origin,profileId});
  window.location.href=response.data.url;
}
export default function WeeklyReview(){const s=getSession()||{},[insight,setInsight]=useState('Reviewing your week...');useEffect(()=>{if(!s.is_paid)return;base44.integrations.Core.InvokeLLM({prompt:`Give one specific, concise observation and next action from this week: tasks completed ${s.tasks_completed||0}, earned $${s.money_earned||0}, path ${(s.chosen_option||{}).title}. No buzzwords.`}).then(setInsight)},[]);return <MobileShell><div className="min-h-[680px] bg-gray-50 p-5"><Link to="/dashboard" className="text-sm text-[#399d9d]">← Workspace</Link><h1 className="text-3xl font-black text-[#183b3b] mt-6">Weekly review</h1>{!s.is_paid?<div className="bg-white rounded-2xl p-5 mt-6"><p className="font-bold">FirstDollar Plus feature</p><p className="text-sm text-gray-500 mt-2">Unlock weekly reviews and multiple income streams for $7.99/month.</p><button onClick={()=>upgrade(s.profile_id)} className="mt-4 bg-[#183b3b] text-white rounded-full px-5 py-3 text-sm font-bold">Get FirstDollar Plus</button></div>:<><div className="grid grid-cols-2 gap-3 mt-6"><div className="bg-white p-4 rounded-2xl"><b>{s.tasks_completed||0}</b><p className="text-xs text-gray-500">tasks done</p></div><div className="bg-white p-4 rounded-2xl"><b>${s.money_earned||0}</b><p className="text-xs text-gray-500">earned</p></div></div><div className="bg-[#183b3b] text-white rounded-2xl p-5 mt-4"><p className="text-xs text-[#7dd4d4] font-bold">SPARKY NOTICED</p><p className="mt-2 text-sm">{insight}</p></div></>}</div></MobileShell>}