import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getSession, saveSession } from '@/lib/onboardingState';
import { generateOptions } from '@/lib/sparkyAI';

export default function Processing() {
  const navigate = useNavigate(), [error, setError] = useState(''), [attempt, setAttempt] = useState(0);
  useEffect(() => { const run = async () => { setError(''); const s = getSession() || {}; try {
    const user = await base44.auth.me();
    const existing = await base44.entities.UserProfile.filter({ created_by_id: user.id });
    const profileData = { name: s.name, location: s.location, situation: s.situation, timeline: s.timeline, hours_per_week: s.hours_per_week, selected_assets: s.selected_assets, extra_skills_text: s.extra_skills_text, onboarding_complete: true };
    const profile = existing[0] ? await base44.entities.UserProfile.update(existing[0].id, profileData) : await base44.entities.UserProfile.create(profileData);
    const result = await generateOptions(profile);
    await base44.entities.RecommendationSet.create({ option_1_json: result.option_1, option_2_json: result.option_2, rejected_options: [], date_generated: new Date().toISOString(), status: 'active' });
    saveSession({ ...s, profile_id: profile.id });
    navigate('/results');
  } catch (e) { setError(e.message || 'We could not build your options.'); } }; run(); }, [attempt]);
  return <MobileShell><div className="min-h-[680px] flex flex-col items-center justify-center p-8 text-center bg-[#183b3b] text-white"><div className="text-6xl">⚡</div><h1 className="text-2xl font-black mt-6">Finding your fastest paths...</h1><p className="text-white/60 mt-3">Matching what you have with what can earn first.</p>{error && <div className="mt-8"><p className="text-red-200 text-sm">{error}</p><button onClick={() => setAttempt(x => x + 1)} className="mt-4 bg-[#5BC8C8] px-6 py-3 rounded-full font-bold">Try again</button></div>}</div></MobileShell>;
}