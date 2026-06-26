import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const OPTIONS = [
  { id: 'laid_off', label: 'I was recently laid off' },
  { id: 'might_lose', label: 'I might lose my job soon' },
  { id: 'extra_income', label: 'I need extra income quickly' },
  { id: 'try_something', label: 'I just want to try something new' },
];

export default function OnboardingSituation() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const name = session.name || 'there';
  const [step, setStep] = useState('question'); // 'question' | 'response'
  const [selected, setSelected] = useState(null);

  const RESPONSES = {
    laid_off: { headline: 'Just got laid off?', sub: "Let's help you earn\nyour first dollar here.", emoji: '💔' },
    might_lose: { headline: 'Uh-oh! Your job is\nat stake.', sub: "Let's help you earn\nyour first dollar here.", emoji: '😰' },
    extra_income: { headline: 'Got it! You need some\nextra money.', sub: "Let's help you earn\nyour first dollar here.", emoji: '🐷' },
    try_something: { headline: "Sure!\nLet's explore something NEW", sub: 'to earn your first dollar here.', emoji: '🔮' },
  };

  const handleSelect = (id) => {
    setSelected(id);
    saveSession({ ...session, situation: id });
    setStep('response');
  };

  const handleContinue = () => navigate('/onboarding/timeline');

  const response = selected ? RESPONSES[selected] : null;

  if (step === 'question') {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
        <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-[#2c4a4a]">Thx, {name}!</p>
            <p className="text-base font-bold text-[#2c4a4a] mt-2">What best describes<br />your situation<br />right now?</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SparkyAvatar size={130} expression="thinking" />
          </div>
        </div>
        <div className="px-6 pb-6">
          <TealButton onClick={() => setStep('options')}>Continue</TealButton>
        </div>
      </MobileShell>
    );
  }

  if (step === 'options') {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
        <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-1">
          {OPTIONS.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="w-full py-4 border-b border-gray-100 flex flex-col items-center hover:bg-teal-50 transition-colors rounded-lg active:bg-teal-100"
            >
              <span className="text-[#5BC8C8] font-bold text-sm">{i + 1}.</span>
              <span className="text-[#2c4a4a] font-semibold text-sm mt-0.5">{opt.label}</span>
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

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-4">
          <p className="text-base font-semibold text-gray-500 whitespace-pre-line">{response.headline}</p>
          <p className="text-lg font-bold text-[#2c4a4a] mt-2 whitespace-pre-line">{response.sub}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-9xl">{response.emoji}</div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={handleContinue}>Continue</TealButton>
      </div>
    </MobileShell>
  );
}