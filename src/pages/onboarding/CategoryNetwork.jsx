import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import TealButton from '../../components/TealButton';
import { getSession, saveSession } from '../../lib/onboardingState';

const ITEMS = ['I know local business owners', 'I know many parents', 'I know seniors who need help', 'I belong to clubs or organizations'];

export default function CategoryNetwork() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const [checked, setChecked] = useState({});

  const toggleItem = (item) => setChecked(prev => ({ ...prev, [item]: !prev[item] }));

  const handleContinue = () => {
    const newAssets = Object.keys(checked).filter(k => checked[k]);
    const existing = session.selected_assets || [];
    saveSession({ ...session, selected_assets: [...existing, ...newAssets] });
    navigate('/onboarding/category/handson');
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
        <div className="text-5xl mb-2">😊</div>
        <p className="text-[#2c4a4a] font-bold text-center text-sm">You did amazing so far!<br />Sparky found so much potential<br />already! Before we continue...</p>
        <p className="text-[#5BC8C8] text-xs text-center mt-1">(Within your network of people -<br />check all that may fit you)</p>
        <div className="text-2xl my-2">✅</div>
        <div className="w-full flex flex-col divide-y divide-gray-100 mt-2">
          {ITEMS.map(item => (
            <button key={item} onClick={() => toggleItem(item)}
              className={`w-full py-3.5 text-center font-semibold text-sm transition-colors ${checked[item] ? 'text-[#2c4a4a] bg-teal-50' : 'text-[#2c4a4a]'}`}>
              {checked[item] ? '✓ ' : ''}{item}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8"><TealButton onClick={handleContinue}>Continue</TealButton></div>
    </MobileShell>
  );
}