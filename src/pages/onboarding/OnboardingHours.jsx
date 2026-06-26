import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const OPTIONS = [
  { id: 'under_10', label: 'Less than 10 hrs/week' },
  { id: '10_20', label: '10–20 hrs/week' },
  { id: 'over_20', label: '20+ hrs/week' },
];

export default function OnboardingHours() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const [step, setStep] = useState('intro');

  const handleSelect = (id) => {
    saveSession({ ...session, hours_per_week: id });
    navigate('/onboarding/categories');
  };

  if (step === 'intro') {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
        <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-[#2c4a4a]">How much time can you<br />realistically dedicate?</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SparkyAvatar size={150} expression="happy" />
          </div>
        </div>
        <div className="px-6 pb-8">
          <TealButton onClick={() => setStep('options')}>Continue</TealButton>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-1">
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className="w-full py-4 border-b border-gray-100 flex flex-col items-center hover:bg-teal-50 transition-colors rounded-lg"
          >
            <span className="text-[#5BC8C8] font-bold text-sm">{i + 1}.</span>
            <span className="text-[#2c4a4a] font-bold text-base mt-0.5">{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#5BC8C8] flex items-center justify-center text-[#5BC8C8] text-sm">+</div>
          <span className="text-gray-400 text-sm">Pick one! Tell Sparky!</span>
        </div>
      </div>
    </MobileShell>
  );
}