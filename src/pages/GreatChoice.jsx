import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import SparkyImage from '@/components/SparkyImage';
import { getSession } from '@/lib/onboardingState';

export default function GreatChoice() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const chosen = session.chosen_option || {};
  const name = session.name || 'there';
  const optNum = chosen.option_number || 1;
  const [step, setStep] = useState('summary'); // 'summary' | 'ready'

  const reasons = (chosen.why_this_fits_user || '').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4);

  if (step === 'ready') {
    return <MobileShell>
      <div className="flex flex-col min-h-[680px] bg-[#2c4a4a]">
        <WaveHeader height={60}/>
        <div className="flex flex-col items-center flex-1 px-6 pt-4 pb-6">
          <SparkyImage pose="teaching" size={170}/>
          <p className="text-[#5BC8C8] font-bold text-sm mt-3 text-center">Option {optNum} / {chosen.title}</p>
          <p className="text-white font-semibold text-sm mt-2">{name}</p>
          <ChevronDown className="text-[#5BC8C8] mt-0.5" size={18}/>
          <p className="text-white font-black text-xl text-center mt-2 leading-snug">Are you ready to start a detailed plan on how to make some money?</p>
          <p className="text-white/80 text-sm text-center mt-2">Let's see our next steps and goals.</p>
          <div className="mt-auto w-full pt-4">
            <button onClick={() => navigate('/action-plan')} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3.5 font-bold hover:bg-[#7dd4d4] transition-colors">I'm ready!</button>
          </div>
        </div>
      </div>
    </MobileShell>;
  }

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#2c4a4a] cursor-pointer" onClick={() => setStep('ready')}>
      <WaveHeader height={60}/>
      <div className="flex flex-col items-center flex-1 px-6 pt-4 pb-6 overflow-y-auto">
        <SparkyImage pose="excited" size={160}/>
        <p className="text-yellow-300 font-black text-3xl mt-3">Great Choice! 🎉</p>
        <p className="text-[#5BC8C8] font-bold text-sm mt-2">Option {optNum}</p>
        <p className="text-white font-bold text-lg text-center leading-snug">{chosen.title}</p>

        <div className="flex items-center gap-1 mt-4">
          <p className="text-white font-bold text-base">Why this plan fits you:</p>
          <ChevronDown className="text-[#5BC8C8]" size={16}/>
        </div>
        <div className="flex flex-col gap-1.5 mt-2 w-full">
          {reasons.map((reason, i) => (
            <p key={i} className="text-white text-sm text-center leading-snug">{reason}</p>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className="text-[#5BC8C8] text-sm font-bold">Expected First Goal:</p>
          <p className="text-white font-black text-2xl mt-0.5">{chosen.first_goal || '$50–$100'}</p>
        </div>

        <div className="mt-auto w-full pt-5">
          <button className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3.5 font-bold hover:bg-[#7dd4d4] transition-colors">Continue</button>
        </div>
      </div>
    </div>
  </MobileShell>;
}