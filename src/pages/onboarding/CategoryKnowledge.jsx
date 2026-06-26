import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const SCREENS = [
  { prompt: 'You may already have monetizable skills', hint: '(Pick all that you got!)', icon: '🧠', items: ["I'm bilingual", 'I help kids with school', 'I am tech savvy'] },
  { prompt: 'You may already have monetizable skills', hint: '(Pick all that you got!)', icon: '🧠', items: ['I can teach cooking', 'I can teach guitar/music', 'I can teach swimming'] },
  { prompt: 'You may already have monetizable skills', hint: '(Pick all that you got!)', icon: '🧠', items: ['I can teach a sport/a dance', 'I can teach online', 'I can teach arts & crafts'] },
];

export default function CategoryKnowledge() {
  const navigate = useNavigate();
  const [intro, setIntro] = useState(true);
  const [screenIdx, setScreenIdx] = useState(0);
  const [checked, setChecked] = useState({});

  const toggleItem = (item) => setChecked(prev => ({ ...prev, [item]: !prev[item] }));

  const handleContinue = () => {
    const session = getSession() || {};
    const newAssets = Object.keys(checked).filter(k => checked[k]);
    const existing = session.selected_assets || [];
    saveSession({ ...session, selected_assets: [...existing, ...newAssets] });
    if (screenIdx < SCREENS.length - 1) { setScreenIdx(screenIdx + 1); setChecked({}); }
    else navigate('/onboarding/category/creative');
  };

  if (intro) {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
        <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
          <p className="text-[#5BC8C8] font-bold text-lg mb-4">Knowledge & Teaching</p>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-8xl">🧠</div>
            <p className="text-[#2c4a4a] font-bold text-center text-base">Skills people would<br />pay to learn</p>
          </div>
        </div>
        <div className="px-6 pb-8"><TealButton onClick={() => setIntro(false)}>Check it out!</TealButton></div>
      </MobileShell>
    );
  }

  const screen = SCREENS[screenIdx];
  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
        <div className="text-5xl mb-2">{screen.icon}</div>
        <p className="text-[#2c4a4a] font-bold text-center text-sm">{screen.prompt}</p>
        <p className="text-[#5BC8C8] text-xs text-center">{screen.hint}</p>
        <div className="text-2xl my-2">✅</div>
        <div className="w-full flex flex-col divide-y divide-gray-100 mt-2">
          {screen.items.map(item => (
            <button key={item} onClick={() => toggleItem(item)}
              className={`w-full py-3.5 text-center font-semibold text-sm transition-colors ${checked[item] ? 'text-[#2c4a4a] bg-teal-50' : 'text-[#5BC8C8]'}`}>
              {checked[item] ? '✓ ' : ''}{item}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8"><TealButton onClick={handleContinue}>Continue</TealButton></div>
    </MobileShell>
  );
}