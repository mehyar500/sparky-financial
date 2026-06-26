import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SparkyAvatar from '../components/SparkyAvatar';
import TealButton from '../components/TealButton';
import { ChevronDown } from 'lucide-react';
import { getSession } from '../lib/onboardingState';

export default function GreatChoice() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const chosen = session.chosen_option || session.option1 || {};
  const name = session.name || 'there';
  const [step, setStep] = useState('summary'); // 'summary' | 'ready'

  if (step === 'ready') {
    return (
      <MobileShell>
        <div className="flex flex-col h-full min-h-[680px] bg-[#2c4a4a]">
          <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab0b0] rounded-b-[50%_25%]" style={{ minHeight: 60 }} />
          <div className="flex flex-col items-center flex-1 px-6 pt-4 pb-6">
            <SparkyAvatar size={110} expression="excited" />
            <p className="text-[#5BC8C8] font-semibold text-sm mt-3 text-center">Option</p>
            <p className="text-white font-bold text-lg text-center">{chosen.title}</p>
            <p className="text-white text-sm text-center mt-1">{name}</p>
            <ChevronDown className="text-[#5BC8C8] mt-1" size={18} />
            <p className="text-white font-bold text-lg text-center mt-2">Are you ready to start a<br />detailed plan on how to<br />make some money?</p>
            <p className="text-gray-300 text-sm text-center mt-2">Let's see our<br />next steps and goals.</p>
            <div className="mt-auto w-full">
              <TealButton onClick={() => navigate('/action-plan')}>I'm ready!</TealButton>
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col h-full min-h-[680px] bg-[#2c4a4a]">
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab0b0] rounded-b-[50%_25%]" style={{ minHeight: 60 }} />
        <div className="flex flex-col items-center flex-1 px-6 pt-4 pb-6 overflow-y-auto">
          <SparkyAvatar size={110} expression="excited" />
          <p className="text-white font-black text-2xl mt-3">Great Choice!</p>
          <p className="text-[#5BC8C8] font-semibold text-sm mt-1">Rent your backyard</p>
          <p className="text-[#5BC8C8] font-semibold text-sm">{chosen.title}</p>

          <p className="text-white font-bold text-base mt-4 text-center">Why this plan fits you:</p>
          <ChevronDown className="text-[#5BC8C8]" size={18} />
          <div className="flex flex-col gap-2 mt-2 w-full">
            {(chosen.why_fits || ['You need income quickly', 'You have available space', 'No startup costs', 'You can begin this week']).map((reason, i) => (
              <p key={i} className="text-white text-sm text-center">{reason}</p>
            ))}
          </div>

          <div className="mt-4 bg-[#1e3535] rounded-xl p-3 w-full text-center">
            <p className="text-[#5BC8C8] text-xs font-bold">Expected First Goal:</p>
            <p className="text-white font-bold text-lg">{chosen.first_goal || '$50–$100'}</p>
          </div>

          <div className="mt-auto w-full pt-4">
            <TealButton onClick={() => setStep('ready')}>Continue</TealButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}