import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntroScreen from '@/components/onboarding/IntroScreen';
import { getSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function CategoryTransition() {
  const navigate = useNavigate();
  const { t } = useT();
  const name = (getSession() || {}).name || t('common.there');
  return (
    <IntroScreen expression="thinking" onContinue={() => navigate('/onboarding/category/food')}>
      <p className="text-[#5BC8C8] font-bold text-base">{t('transition.thanks', { name })}</p>
      <p className="text-[#5BC8C8] font-bold text-base">{t('transition.great')}</p>
      <p className="text-[#2c4a4a] font-bold text-lg mt-3 whitespace-pre-line">{t('transition.uncover')}</p>
    </IntroScreen>
  );
}