import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import ChatInput from '../../components/ChatInput';
import { getSession, saveSession } from '../../lib/onboardingState';

export default function OnboardingName() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (name) => {
    const session = getSession() || {};
    saveSession({ ...session, name });
    setSubmitted(true);
    setTimeout(() => navigate('/onboarding/location'), 400);
  };

  return (
    <MobileShell>
      {/* Teal wave top */}
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />

      {/* Content */}
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-6">
        <div className="text-center mb-6">
          <p className="text-lg font-bold text-[#2c4a4a]">Hi, I'm Sparky.</p>
          <p className="text-[#5BC8C8] font-semibold text-sm mt-1">I'll be helping you</p>
          <p className="text-[#5BC8C8] font-semibold text-sm">find your fastest path</p>
          <p className="text-[#5BC8C8] font-semibold text-sm">to income!</p>
          <p className="text-lg font-bold text-[#2c4a4a] mt-3">How should I call you?</p>
          <p className="text-gray-400 text-sm">(your name)</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={160} expression="waving" />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 pb-8">
        <ChatInput
          placeholder="Tell Sparky here!"
          onSubmit={handleSubmit}
        />
      </div>
    </MobileShell>
  );
}