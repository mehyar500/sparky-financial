import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import TealButton from '@/components/TealButton';
import IntroScreen from '@/components/onboarding/IntroScreen';
import PickList from '@/components/onboarding/PickList';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

const OPTIONS = ['laid_off', 'might_lose', 'extra_income', 'try_something'].map(id => ({ id, label: `situation.${id}` }));
const EMOJI = { laid_off: '💔', might_lose: '😰', extra_income: '🐷', try_something: '🔮' };

export default function OnboardingSituation() {
  const navigate = useNavigate();
  const { t } = useT();
  const session = getSession() || {};
  const name = session.name || t('common.there');
  const [step, setStep] = useState('question'); // 'question' | 'options' | 'response'
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    saveSession({ ...session, situation: id });
    setStep('response');
  };

  if (step === 'question') {
    return (
      <IntroScreen expression="thinking" size={130} onContinue={() => setStep('options')}>
        <p className="text-lg font-bold text-[#2c4a4a]">{t('situation.thx', { name })}</p>
        <p className="text-base font-bold text-[#2c4a4a] mt-2 whitespace-pre-line">{t('situation.ask')}</p>
      </IntroScreen>
    );
  }

  if (step === 'options') return <PickList options={OPTIONS} onSelect={handleSelect} />;

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-4">
          <p className="text-base font-semibold text-gray-500 whitespace-pre-line">{t(`situation.${selected}.headline`)}</p>
          <p className="text-lg font-bold text-[#2c4a4a] mt-2 whitespace-pre-line">{t(`situation.${selected}.sub`)}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-9xl">{EMOJI[selected]}</div>
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={() => navigate('/onboarding/timeline')}>{t('common.continue')}</TealButton>
      </div>
    </MobileShell>
  );
}