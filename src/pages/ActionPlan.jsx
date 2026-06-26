import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import TealButton from '../components/TealButton';
import ChatInput from '../components/ChatInput';
import { ChevronDown } from 'lucide-react';
import { getSession, saveSession } from '../lib/onboardingState';

export default function ActionPlan() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const chosen = session.chosen_option || session.option1 || {};
  const [step, setStep] = useState('overview'); // 'overview' | 'pick_task'

  const steps = chosen.action_steps || ['Take 3 photos', 'Create a listing', 'Share locally', 'Respond to inquiries'];
  const tip = 'Simple photos work better than perfect photos.';

  const handleStartPlan = () => {
    const tasks = steps.map((s, i) => ({ id: i, label: s, done: false }));
    saveSession({
      ...session,
      tasks,
      total_tasks: tasks.length,
      tasks_completed: 0,
      progress_percent: 0,
      first_goal_amount: 50,
      money_earned: 0,
      confidence_score: 30,
      onboarding_complete: true,
    });
    navigate('/dashboard');
  };

  if (step === 'pick_task') {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
        <div className="flex-1 flex flex-col px-8 pt-4 pb-4">
          <div className="flex-1 flex flex-col justify-center gap-1">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={handleStartPlan}
                className="w-full py-4 border-b border-gray-100 flex flex-col items-center hover:bg-teal-50 transition-colors rounded-lg"
              >
                <span className="text-[#5BC8C8] font-bold text-sm">{i + 1}.</span>
                <span className="text-[#2c4a4a] font-semibold text-sm mt-0.5">{s}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#5BC8C8] flex items-center justify-center text-[#5BC8C8] text-sm">+</div>
            <span className="text-gray-400 text-sm">Pick one to start!</span>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="flex flex-col h-full min-h-[680px] bg-[#2c4a4a]">
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab0b0] rounded-b-[50%_25%]" style={{ minHeight: 60 }} />
        <div className="flex flex-col flex-1 px-6 pt-4 pb-4 overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-[#5BC8C8] text-sm font-semibold">{chosen.title}</p>
            <p className="text-white font-bold text-lg mt-1">Your First Goal</p>
            <ChevronDown className="text-[#5BC8C8] mx-auto" size={18} />
            <p className="text-white font-bold text-xl">Earn your first {chosen.first_goal || '$50'}<br />this week.</p>
          </div>

          {/* Checklist */}
          <div className="bg-[#1e3535] rounded-2xl p-4 mb-3">
            <p className="text-[#5BC8C8] text-sm font-bold text-center mb-2">Action Checklist</p>
            <ChevronDown className="text-[#5BC8C8] mx-auto mb-2" size={16} />
            <div className="flex flex-col gap-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-sm bg-[#5BC8C8] mt-1.5 flex-shrink-0" />
                  <p className="text-white font-bold text-sm">{s}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs text-center mt-3 italic">Tip:<br />"{tip}"</p>
          </div>

          <div className="mt-auto">
            <TealButton onClick={() => setStep('pick_task')}>Let's start here!</TealButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}