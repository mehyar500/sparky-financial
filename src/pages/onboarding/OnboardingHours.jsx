import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroScreen from '@/components/onboarding/IntroScreen';
import PickList from '@/components/onboarding/PickList';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

const OPTIONS = ['under_10', '10_20', 'over_20'].map(id => ({ id, label: `hours.${id}` }));

export default function OnboardingHours() {
  const navigate = useNavigate();
  const { t } = useT();
  const [step, setStep] = useState('intro');

  const handleSelect = (id) => {
    saveSession({ ...(getSession() || {}), hours_per_week: id });
    navigate('/onboarding/categories');
  };

  if (step === 'intro') {
    return (
      <IntroScreen expression="happy" onContinue={() => setStep('options')}>
        <p className="text-lg font-bold text-[#2c4a4a] whitespace-pre-line">{t('hours.ask')}</p>
      </IntroScreen>
    );
  }

  return <PickList options={OPTIONS} onSelect={handleSelect} />;
}