import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import ChatInput from '@/components/ChatInput';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function OnboardingName() {
  const navigate = useNavigate();
  const { t } = useT();

  const handleSubmit = (name) => {
    saveSession({ ...(getSession() || {}), name });
    setTimeout(() => navigate('/onboarding/location'), 400);
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-6">
        <div className="text-center mb-6">
          <p className="text-lg font-bold text-[#2c4a4a]">{t('name.hi')}</p>
          <p className="text-[#5BC8C8] font-semibold text-sm mt-1 whitespace-pre-line">{t('name.help')}</p>
          <p className="text-lg font-bold text-[#2c4a4a] mt-3">{t('name.ask')}</p>
          <p className="text-gray-400 text-sm">{t('name.hint')}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={160} expression="waving" />
        </div>
      </div>
      <div className="px-6 pb-8">
        <ChatInput placeholder={t('common.tellSparky')} onSubmit={handleSubmit} />
      </div>
    </MobileShell>
  );
}