import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SparkyAvatar from '../components/SparkyAvatar';
import TealButton from '../components/TealButton';
import ChatInput from '../components/ChatInput';
import { getSession, saveSession } from '../lib/onboardingState';
import { base44 } from '../api/base44Client';

export default function TimeToPick() {
  const navigate = useNavigate();
  const session = getSession() || {};
  const opt1 = session.option1 || {};
  const opt2 = session.option2 || {};
  const [reprocessing, setReprocessing] = useState(false);
  const [dots, setDots] = useState('');

  const handlePick = (optKey) => {
    const chosen = optKey === 'opt1' ? opt1 : opt2;
    saveSession({ ...session, chosen_option: chosen });
    navigate('/confetti');
  };

  const handleSuggestion = async (suggestion) => {
    setReprocessing(true);
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);

    const prompt = `You are Sparky, an AI income coach. The user has suggested this idea: "${suggestion}". 
Based on their profile (name: ${session.name}, location: ${session.location}, assets: ${(session.selected_assets || []).join(', ')}), 
generate 2 DIFFERENT realistic income options that align with their suggestion.

Return ONLY valid JSON:
{
  "option1": { "title": "...", "income_range": "$X–$Y/week", "fastest_path": "...", "best_for": "...", "why_picked": "...", "action_steps": ["...","...","...","..."], "first_goal": "$50–$100", "why_fits": ["...","...","...","..."] },
  "option2": { "title": "...", "income_range": "$X–$Y/week", "fastest_path": "...", "best_for": "...", "why_picked": "...", "action_steps": ["...","...","...","..."], "first_goal": "$50–$100", "why_fits": ["...","...","...","..."] }
}`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        model: 'claude_sonnet_4_6',
        prompt,
        response_json_schema: { type: 'object', properties: { option1: { type: 'object' }, option2: { type: 'object' } } }
      });
      const data = result?.option1 ? result : (result?.response || {});
      if (data.option1 && data.option2) saveSession({ ...session, option1: data.option1, option2: data.option2 });
    } catch {}
    clearInterval(interval);
    setReprocessing(false);
    navigate('/results');
  };

  if (reprocessing) {
    return (
      <MobileShell>
        <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
        <div className="flex flex-col items-center px-8 flex-1 justify-center">
          <p className="text-[#5BC8C8] text-base font-semibold text-center">Just a moment, now.</p>
          <p className="text-[#2c4a4a] font-bold text-lg text-center mt-2">Sparky is thinking hard<br />to build you another<br />2-choice<br />Personalized Plan{dots}</p>
          <div className="text-7xl mt-6">⚙️</div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-6 flex-1 pt-4 pb-4">
        <div className="text-center mb-4">
          <p className="text-[#5BC8C8] font-semibold text-sm">Let's start<br />our Action Plan now?</p>
          <p className="text-[#2c4a4a] font-bold text-lg mt-2">Which option should<br />we go with?</p>
        </div>

        <div className="flex flex-1 gap-6 items-center w-full justify-center">
          <SparkyAvatar size={100} expression="waving" />
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handlePick('opt1')}
              className="bg-[#2c4a4a] text-white font-bold rounded-xl px-6 py-3 hover:bg-[#1e3535] transition-colors text-sm"
            >
              Option 1
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[#5BC8C8] text-xs">Click one</span>
            </div>
            <button
              onClick={() => handlePick('opt2')}
              className="bg-[#2c4a4a] text-white font-bold rounded-xl px-6 py-3 hover:bg-[#1e3535] transition-colors text-sm"
            >
              Option 2
            </button>
          </div>
        </div>

        <div className="w-full mt-2">
          <p className="text-[#5BC8C8] text-xs text-center mb-2">Not these above Sparky.<br />I have suggestions! Let me explain:</p>
          <ChatInput placeholder="What's your suggestion?" onSubmit={handleSuggestion} />
        </div>
      </div>
    </MobileShell>
  );
}