import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntroScreen from '@/components/onboarding/IntroScreen';
import { getSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function WorkDone() {
  const navigate = useNavigate();
  const { t } = useT();
  const name = (getSession() || {}).name || t('common.there');
  return (
    <IntroScreen expression="excited" size={160} onContinue={() => navigate('/onboarding/processing')}>
      <p className="text-[#5BC8C8] font-bold text-base">{t('workDone.great', { name })}</p>
      <p className="text-[#5BC8C8] font-bold text-base">{t('workDone.offer')}</p>
      <p className="text-[#2c4a4a] font-bold text-lg mt-3 whitespace-pre-line">{t('workDone.finding')}</p>
    </IntroScreen>
  );
}