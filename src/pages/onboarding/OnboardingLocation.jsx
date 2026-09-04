import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import LocationPicker from '@/components/LocationPicker';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function OnboardingLocation() {
  const navigate = useNavigate();
  const { t } = useT();
  const session = getSession() || {};
  const name = session.name || t('common.there');

  const handleSubmit = (location) => {
    saveSession({ ...session, location });
    navigate('/onboarding/situation');
  };

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-6">
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-[#2c4a4a]">{t('location.hi', { name })}</p>
          <p className="text-lg font-bold text-[#2c4a4a] mt-1">{t('location.pleased')}</p>
          <p className="text-base font-semibold text-[#2c4a4a] mt-3 whitespace-pre-line">{t('location.ask')}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={150} expression="happy" />
        </div>
        <p className="text-[#5BC8C8] text-xs text-center italic mb-4 whitespace-pre-line">{t('location.note')}</p>
      </div>
      <div className="px-6 pb-8">
        <LocationPicker initialValue={session.location || ''} onSubmit={handleSubmit} />
      </div>
    </MobileShell>
  );
}