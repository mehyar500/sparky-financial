import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import TealButton from '@/components/TealButton';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

const CATEGORIES = [
  { emoji: '🏠', key: 'cat.home' },
  { emoji: '🍳', key: 'cat.food' },
  { emoji: '🧠', key: 'cat.knowledge' },
  { emoji: '🎨', key: 'cat.creative' },
  { emoji: '🔧', key: 'cat.handson' },
  { emoji: '💻', key: 'cat.online' },
];

export default function OnboardingCategories() {
  const navigate = useNavigate();
  const { t } = useT();
  const session = getSession() || {};
  const name = session.name || t('common.there');

  const handleStart = () => {
    saveSession({ ...session, selected_assets: [] });
    navigate('/onboarding/category/home');
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-5 pb-4">
        <div className="text-center mb-5">
          <p className="text-base font-bold text-[#2c4a4a] whitespace-pre-line">{t('categories.intro', { name })}</p>
          <p className="text-base font-bold text-[#2c4a4a] mt-1">{t('categories.ready')}</p>
        </div>
        <div className="w-full flex flex-col gap-2 flex-1">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="flex items-center gap-3 py-1">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[#2c4a4a] font-semibold text-base">{t(cat.key)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={handleStart}>{t('categories.yes')}</TealButton>
      </div>
    </MobileShell>
  );
}