import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const CATEGORIES = [
  { emoji: '🏠', label: 'Home & Space' },
  { emoji: '🍳', label: 'Food & Hospitality' },
  { emoji: '🧠', label: 'Knowledge & Teaching' },
  { emoji: '🎨', label: 'Creative Skills' },
  { emoji: '🔧', label: 'Hands-On Work' },
  { emoji: '💻', label: 'Online Work' },
];

export default function OnboardingCategories() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const name = session.name || 'there';

  const handleStart = () => {
    saveSession({ ...session, selected_assets: [] });
    navigate('/onboarding/category/home');
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
        <div className="text-center mb-5">
          <p className="text-base font-bold text-[#2c4a4a]">{name}, we got some<br />discovery to do below.</p>
          <p className="text-base font-bold text-[#2c4a4a] mt-1">Are you ready?</p>
        </div>

        <div className="w-full flex flex-col gap-2 flex-1">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3 py-1">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[#2c4a4a] font-semibold text-base">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <TealButton onClick={handleStart}>Yes, I'm ready!</TealButton>
      </div>
    </MobileShell>
  );
}