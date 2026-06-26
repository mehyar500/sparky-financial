import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SparkyAvatar from '../components/SparkyAvatar';
import TealButton from '../components/TealButton';
import { clearSession } from '../lib/onboardingState';

export default function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    clearSession();
    navigate('/onboarding/name');
  };

  return (
    <MobileShell>
      <div className="flex flex-col items-center justify-between h-full min-h-[680px] bg-white">
        {/* Top teal wave section */}
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] flex flex-col items-center pt-10 pb-10 rounded-b-[60%_30%]" style={{ minHeight: 320 }}>
          <SparkyAvatar size={150} expression="happy" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center px-8 py-8 gap-4 flex-1 justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black text-[#2c4a4a] tracking-tight">FirstDollar</h1>
            <p className="text-[#5BC8C8] font-semibold text-base mt-1">Earn money with the things you have</p>
          </div>

          <p className="text-gray-400 text-xs font-medium tracking-widest uppercase mt-2">by stringflix™</p>

          <p className="text-center text-gray-500 text-sm mt-2 italic">
            Just got laid off? Let's help you earn your first dollar again.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full px-8 pb-10">
          <TealButton onClick={handleStart}>
            Let's start by meeting your AI coach!
          </TealButton>
        </div>
      </div>
    </MobileShell>
  );
}