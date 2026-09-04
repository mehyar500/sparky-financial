import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getSession, saveSession } from '@/lib/onboardingState';
import { generateOptions } from '@/lib/sparkyAI';
import { useT } from '@/lib/i18n';

const STAGES = [
  { emoji: '⚡', key: 'processing.s1' },
  { emoji: '🔍', key: 'processing.s2' },
  { emoji: '🗺️', key: 'processing.s3' },
  { emoji: '💡', key: 'processing.s4' },
  { emoji: '🚀', key: 'processing.s5' },
];

export default function Processing() {
  const navigate = useNavigate(), { t, lang } = useT(), [error, setError] = useState(''), [attempt, setAttempt] = useState(0);
  const [stage, setStage] = useState(0), [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setStage(s => (s + 1) % STAGES.length); setVisible(true); }, 250);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { const run = async () => { setError(''); const s = getSession() || {}; try {
    const user = await base44.auth.me();
    const existing = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
    const prev = existing[0];
    // Each onboarding run creates a fresh profile for its own path; carry over payment entitlements.
    const profile = await base44.entities.UserProfile.create({
      name: s.name, location: s.location, situation: s.situation, timeline: s.timeline, hours_per_week: s.hours_per_week, selected_assets: s.selected_assets, extra_skills_text: s.extra_skills_text, onboarding_complete: true,
      language: lang, whatsapp_opt_in: Boolean(s.whatsapp_opt_in), whatsapp_prompted: Boolean(s.whatsapp_prompted), daily_nudges_on: true,
      is_paid: prev?.is_paid || false, stripe_customer_id: prev?.stripe_customer_id || '', stripe_subscription_id: prev?.stripe_subscription_id || ''
    });
    const result = await generateOptions(profile);
    await base44.entities.RecommendationSet.create({ option_1_json: result.option_1, option_2_json: result.option_2, rejected_options: [], date_generated: new Date().toISOString(), status: 'active' });
    saveSession({ ...s, profile_id: profile.id });
    navigate('/results');
  } catch (e) { setError(e.message || t('processing.error')); } }; run(); }, [attempt]);

  const current = STAGES[stage];

  return <MobileShell>
    <div className="min-h-[680px] flex flex-col items-center justify-center p-8 text-center bg-[#183b3b] text-white">
      <div
        className="transition-all duration-300 ease-out"
        style={{ fontSize: 96, lineHeight: 1, opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.7)' }}
      >
        {current.emoji}
      </div>
      <h1 className="text-2xl font-black mt-8">{t('processing.title')}</h1>
      <p
        className="text-white/60 mt-3 transition-opacity duration-300 min-h-[24px]"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {t(current.key)}
      </p>
      {error && <div className="mt-8"><p className="text-red-200 text-sm">{error}</p><button onClick={() => setAttempt(x => x + 1)} className="mt-4 bg-[#5BC8C8] px-6 py-3 rounded-full font-bold">{t('processing.retry')}</button></div>}
    </div>
  </MobileShell>;
}