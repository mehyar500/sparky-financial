import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import TealButton from '@/components/TealButton';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

// screens: [{ prompt, hint, items }] — all values are translation keys
export default function CategoryFlow({ emoji, title, intro, screens, next }) {
  const navigate = useNavigate();
  const { t } = useT();
  const [showIntro, setShowIntro] = useState(Boolean(intro));
  const [idx, setIdx] = useState(0);
  const [checked, setChecked] = useState({});

  const toggle = key => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const handleContinue = () => {
    const session = getSession() || {};
    const newAssets = Object.keys(checked).filter(k => checked[k]).map(k => t(k));
    saveSession({ ...session, selected_assets: [...(session.selected_assets || []), ...newAssets] });
    if (idx < screens.length - 1) { setIdx(idx + 1); setChecked({}); }
    else navigate(next);
  };

  if (showIntro) {
    return <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <p className="text-[#5BC8C8] font-bold text-lg mb-4">{t(title)}</p>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-8xl">{emoji}</div>
          <p className="text-[#2c4a4a] font-bold text-center text-base whitespace-pre-line">{t(intro)}</p>
        </div>
      </div>
      <div className="px-6 pb-8"><TealButton onClick={() => setShowIntro(false)}>{t('common.checkItOut')}</TealButton></div>
    </MobileShell>;
  }

  const screen = screens[idx];
  return <MobileShell>
    <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
    <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
      <div className="text-5xl mb-2">{emoji}</div>
      <p className="text-[#2c4a4a] font-bold text-center text-sm whitespace-pre-line">{t(screen.prompt)}</p>
      <p className="text-[#5BC8C8] text-xs text-center whitespace-pre-line">{t(screen.hint)}</p>
      <div className="text-2xl my-2">✅</div>
      <div className="w-full flex flex-col divide-y divide-gray-100 mt-2">
        {screen.items.map(key => (
          <button key={key} onClick={() => toggle(key)}
            className={`w-full py-3.5 px-2 text-center font-semibold text-sm transition-colors ${checked[key] ? 'text-[#2c4a4a] bg-teal-50' : 'text-[#5BC8C8]'}`}>
            {checked[key] ? '✓ ' : ''}{t(key)}
          </button>
        ))}
      </div>
    </div>
    <div className="px-6 pb-8"><TealButton onClick={handleContinue}>{t('common.continue')}</TealButton></div>
  </MobileShell>;
}