import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import TealButton from '../../components/TealButton';
import { getSession } from '../../lib/onboardingState';

export default function CategoryTransition() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const name = session.name || 'there';

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-4">
          <p className="text-[#5BC8C8] font-bold text-base">Thank you, {name}.</p>
          <p className="text-[#5BC8C8] font-bold text-base">You are doing great!</p>
          <p className="text-[#2c4a4a] font-bold text-lg mt-3">Now - Let's uncover<br />what you're<br />naturally good at.</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={150} expression="thinking" />
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={() => navigate('/onboarding/category/food')}>Continue</TealButton>
      </div>
    </MobileShell>
  );
}