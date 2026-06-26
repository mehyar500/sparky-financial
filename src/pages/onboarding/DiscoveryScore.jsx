import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import TealButton from '../../components/TealButton';
import { getSession } from '../../lib/onboardingState';

export default function DiscoveryScore() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const counts = session.asset_counts || {};
  const total = session.total_assets || Object.values(counts).reduce((a, b) => a + b, 0);

  const DISPLAY = [
    { key: 'Home Assets', emoji: '🏠' },
    { key: 'Knowledge Assets', emoji: '🧠' },
    { key: 'Creative Assets', emoji: '🎨' },
    { key: 'Online Assets', emoji: '💻' },
  ];

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-6">
          <p className="text-[#2c4a4a] font-bold text-lg">Wow! Sparky discovered <span className="text-[#5BC8C8]">{total}</span><br />possible income assets.</p>
        </div>

        <div className="w-full flex flex-col gap-3 mb-4">
          {DISPLAY.map(({ key, emoji }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <span className="text-[#2c4a4a] font-semibold text-base">{key}: <span className="text-[#5BC8C8] font-bold">{counts[key] || 0}</span></span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={140} expression="excited" />
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={() => navigate('/onboarding/results-announce')}>Continue</TealButton>
      </div>
    </MobileShell>
  );
}