import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroScreen from '@/components/onboarding/IntroScreen';
import PickList from '@/components/onboarding/PickList';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

const OPTIONS = ['this_week', '2_3_weeks', 'month'].map(id => ({ id, label: `timeline.${id}` }));

export default function OnboardingTimeline() {
  const navigate = useNavigate();
  const { t } = useT();
  const [step, setStep] = useState('intro');

  const handleSelect = (id) => {
    saveSession({ ...(getSession() || {}), timeline: id });
    navigate('/onboarding/hours');
  };

  if (step === 'intro') {
    return (
      <IntroScreen expression="thinking" onContinue={() => setStep('options')}>
        <p className="text-lg font-bold text-[#2c4a4a] whitespace-pre-line">{t('timeline.ask')}</p>
      </IntroScreen>
    );
  }

  return <PickList options={OPTIONS} onSelect={handleSelect} note="timeline.affects" />;
}