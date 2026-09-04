import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import ChatInput from '@/components/ChatInput';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function ExtraSkills() {
  const navigate = useNavigate();
  const { t } = useT();

  const handleSubmit = (text) => {
    saveSession({ ...(getSession() || {}), extra_skills_text: text });
    navigate('/onboarding/work-done');
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-4">
          <p className="text-lg font-bold text-[#2c4a4a]">{t('extra.excellent')}</p>
          <p className="text-base font-semibold text-[#2c4a4a] mt-1 whitespace-pre-line">{t('extra.knowing')}</p>
          <p className="text-base font-bold text-[#2c4a4a] mt-3 whitespace-pre-line">{t('extra.ask')}</p>
          <p className="text-gray-400 text-sm">{t('extra.hint')}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={150} expression="happy" />
        </div>
      </div>
      <div className="px-6 pb-4">
        <ChatInput placeholder={t('common.tellSparky')} onSubmit={handleSubmit} />
      </div>
      <div className="px-6 pb-6">
        <button onClick={() => navigate('/onboarding/work-done')} className="w-full text-center text-[#5BC8C8] text-sm font-medium py-2">
          {t('extra.skip')}
        </button>
      </div>
    </MobileShell>
  );
}