import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import TealButton from '../components/TealButton';
import { ChevronUp, ChevronDown, Lock } from 'lucide-react';
import { getSession, saveSession } from '../lib/onboardingState';

export default function Results() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const opt1 = session.option1 || {};
  const opt2 = session.option2 || {};
  const isPaid = session.is_paid || false;
  const [activeView, setActiveView] = useState(null); // null | 'opt1' | 'opt2'

  const handleExplore = (optKey) => {
    if (optKey === 'opt2' && !isPaid) return; // gated
    setActiveView(optKey);
  };

  const handleFurtherExplore = () => {
    const opt = activeView === 'opt1' ? opt1 : opt2;
    saveSession({ ...session, chosen_for_plan: activeView, exploring_option: opt });
    navigate('/time-to-pick');
  };

  if (activeView) {
    const opt = activeView === 'opt1' ? opt1 : opt2;
    const label = activeView === 'opt1' ? 'Option 1' : 'Option 2';
    return (
      <MobileShell>
        <div className="flex flex-col h-full bg-[#2c4a4a] min-h-[680px]">
          <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab0b0] rounded-b-[50%_25%]" style={{ minHeight: 60 }} />
          <div className="flex flex-col flex-1 px-6 pt-4 pb-4 overflow-y-auto">
            <div className="text-center mb-4">
              <p className="text-white font-bold text-base">{label}</p>
              <ChevronDown className="text-[#5BC8C8] mx-auto" size={20} />
              <p className="text-white font-bold text-xl mt-1">{opt.title}</p>
            </div>

            <div className="bg-[#1e3535] rounded-2xl p-4 mb-3">
              <p className="text-[#5BC8C8] text-xs font-bold text-center">Typical Starter Income:</p>
              <p className="text-white font-bold text-lg text-center">{opt.income_range}</p>
              <p className="text-[#5BC8C8] text-xs font-bold text-center mt-2">{opt.fastest_path ? 'Fastest Path:' : 'Best For:'}</p>
              <p className="text-white font-semibold text-sm text-center">{opt.fastest_path || opt.best_for}</p>
            </div>

            <div className="bg-[#1e3535] rounded-2xl p-4 mb-4">
              <p className="text-[#5BC8C8] text-xs font-bold text-center">Why Sparky picked this:</p>
              <p className="text-white text-sm text-center mt-1 italic">"{opt.why_picked}"</p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <TealButton variant="secondary" onClick={() => setActiveView(null)}>Back to both options.</TealButton>
              <TealButton onClick={handleFurtherExplore}>Further explore a plan for me!</TealButton>
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col h-full min-h-[680px] bg-[#2c4a4a]">
        {/* Teal arc top */}
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab0b0] rounded-b-[50%_25%] flex items-end justify-center pb-2 pt-4" style={{ minHeight: 70 }}>
          <p className="text-white text-xs font-semibold text-center px-4">Let's explore these<br />two choices before<br />we continue.</p>
        </div>

        <div className="flex flex-col flex-1">
          {/* Option 1 */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 border-b border-[#3a6060]">
            <p className="text-white font-bold text-xl text-center mb-2">{opt1.title || 'Option 1'}</p>
            <ChevronUp className="text-[#5BC8C8]" size={24} />
            <button
              onClick={() => handleExplore('opt1')}
              className="mt-3 w-full max-w-[200px] bg-transparent border border-white rounded-full py-2.5 text-white font-semibold text-sm hover:bg-white hover:text-[#2c4a4a] transition-colors"
            >
              Option 1
            </button>
          </div>

          {/* Option 2 */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 relative">
            {!isPaid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e3535] bg-opacity-80 z-10 rounded-none">
                <Lock className="text-[#5BC8C8] mb-2" size={36} />
                <button
                  onClick={() => { saveSession({ ...session, is_paid: true }); window.location.reload(); }}
                  className="bg-[#5BC8C8] text-white rounded-full py-2.5 px-5 font-bold text-sm mt-1"
                >
                  Unlock my personalized plan<br />& coaching for $7.99/month
                </button>
              </div>
            )}
            <button
              onClick={() => handleExplore('opt2')}
              className="w-full max-w-[200px] bg-transparent border border-white rounded-full py-2.5 text-white font-semibold text-sm hover:bg-white hover:text-[#2c4a4a] transition-colors"
            >
              Option 2
            </button>
            <ChevronDown className="text-[#5BC8C8] mt-2" size={24} />
            <p className="text-white font-bold text-xl text-center mt-2">{opt2.title || 'Option 2'}</p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}