import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import SparkyAvatar from '../../components/SparkyAvatar';
import TealButton from '../../components/TealButton';

export default function ResultsAnnounce() {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
        <div className="text-center mb-4">
          <p className="text-gray-500 font-semibold text-base">Good News!</p>
          <p className="text-[#2c4a4a] font-bold text-lg mt-2">Sparky found 2 realistic<br />ways you could start<br />earning this week.</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SparkyAvatar size={160} expression="excited" />
        </div>
      </div>
      <div className="px-6 pb-8">
        <TealButton onClick={() => navigate('/results')}>Continue</TealButton>
      </div>
    </MobileShell>
  );
}