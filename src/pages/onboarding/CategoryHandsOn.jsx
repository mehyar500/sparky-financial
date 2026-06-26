import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const ITEMS = ['I enjoy building, fixing, or working with my hands', 'I like working outside, gardening/moving things'];

export default function CategoryHandsOn() {
  const navigate = useNavigate();
  const [intro, setIntro] = useState(true);
  const [checked, setChecked] = useState({});

  const toggleItem = (item) => setChecked(prev => ({ ...prev, [item]: !prev[item] }));

  const handleContinue = () => {
    const session = getSession() || {};
    const newAssets = Object.keys(checked).filter(k => checked[k]);
    const existing = session.selected_assets || [];
    saveSession({ ...session, selected_assets: [...existing, ...newAssets] });
    navigate('/onboarding/category/online');
  };

  if (intro) {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
        <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
          <p className="text-[#5BC8C8] font-bold text-lg mb-4">Hands-On Work</p>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-8xl">🔧</div>
            <p className="text-[#2c4a4a] font-bold text-center text-base">Physical tasks and<br />practical work</p>
          </div>
        </div>
        <div className="px-6 pb-8"><TealButton onClick={() => setIntro(false)}>Check it out!</TealButton></div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
        <div className="text-5xl mb-2">🔧</div>
        <p className="text-[#2c4a4a] font-bold text-center text-sm">Pick what fits you</p>
        <p className="text-[#5BC8C8] text-xs text-center">(Remember of the times you helped with moving,<br />driving, DIY, cleaning, etc)</p>
        <div className="text-2xl my-2">✅</div>
        <div className="w-full flex flex-col divide-y divide-gray-100 mt-2">
          {ITEMS.map(item => (
            <button key={item} onClick={() => toggleItem(item)}
              className={`w-full py-3.5 px-2 text-center font-semibold text-sm transition-colors ${checked[item] ? 'text-[#2c4a4a] bg-teal-50' : 'text-[#5BC8C8]'}`}>
              {checked[item] ? '✓ ' : ''}{item}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8"><TealButton onClick={handleContinue}>Continue</TealButton></div>
    </MobileShell>
  );
}