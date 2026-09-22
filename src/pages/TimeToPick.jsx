import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import SparkyImage from '@/components/SparkyImage';
import ChatInput from '@/components/ChatInput';
import { getSession, saveSession } from '@/lib/onboardingState';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActiveRecSet } from '@/lib/pathData';
import { generateOptions } from '@/lib/sparkyAI';
import { useT } from '@/lib/i18n';

export default function TimeToPick() {
  const navigate = useNavigate();
  const { t } = useT();
  const [state, setState] = useState({ loading: true, profile: null, recSet: null });
  const [reprocessing, setReprocessing] = useState(false);

  useEffect(() => { (async () => {
    const [profile, recSet] = await Promise.all([getMyProfile(), getActiveRecSet()]);
    if (!recSet) { navigate('/results'); return; }
    setState({ loading: false, profile, recSet });
  })(); }, []);

  const pick = num => {
    const option = num === 1 ? state.recSet.option_1_json : state.recSet.option_2_json;
    saveSession({ ...(getSession() || {}), chosen_option: { ...option, option_number: num } });
    navigate('/action-plan');
  };

  const handleSuggestion = async suggestion => {
    setReprocessing(true);
    const { recSet, profile } = state;
    const data = await generateOptions(profile || {}, {
      rejected: [recSet.option_1_json, recSet.option_2_json].filter(Boolean),
      reason: suggestion,
      preferences: suggestion
    });
    await base44.entities.RecommendationSet.update(recSet.id, {
      option_1_json: data.option_1,
      option_2_json: data.option_2,
      rejected_options: [...(recSet.rejected_options || []), recSet.option_1_json, recSet.option_2_json].filter(Boolean),
      request_for_alternatives: suggestion,
      date_generated: new Date().toISOString()
    });
    navigate('/results');
  };

  if (state.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  if (reprocessing) {
    return <MobileShell>
      <div className="flex flex-col min-h-[680px] bg-white">
        <WaveHeader height={80}/>
        <div className="flex flex-col items-center flex-1 justify-center px-8 text-center pb-10">
          <p className="text-[#5BC8C8] font-bold text-base">{t('pick.gotIt', { name: state.profile?.name || t('common.friend') })}</p>
          <p className="text-[#1e2f2f] font-black text-xl mt-3 leading-snug">{t('pick.thinking')}</p>
          <SparkyImage pose="thinking" size={200} className="mt-8"/>
        </div>
      </div>
    </MobileShell>;
  }

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-white">
      <WaveHeader height={80}/>
      <div className="text-center px-6 mt-4">
        <p className="text-[#5BC8C8] font-bold text-sm">{t('pick.start')}</p>
        <p className="text-[#1e2f2f] font-black text-2xl mt-1">{t('pick.which')}</p>
      </div>

      <div className="flex items-center justify-center gap-4 px-6 flex-1">
        <SparkyImage pose="waving" size={140}/>
        <div className="flex flex-col items-center gap-1.5">
          <button onClick={() => pick(1)} className="bg-[#2c4a4a] text-white font-bold rounded-full px-10 py-3 text-sm hover:bg-[#1e3535] transition-colors">{t('common.option', { n: 1 })}</button>
          <ChevronUp className="text-[#5BC8C8]" size={18}/>
          <span className="text-[#5BC8C8] text-xs font-semibold">{t('pick.clickOne')}</span>
          <ChevronDown className="text-[#5BC8C8]" size={18}/>
          <button onClick={() => pick(2)} className="bg-[#2c4a4a] text-white font-bold rounded-full px-10 py-3 text-sm hover:bg-[#1e3535] transition-colors">{t('common.option', { n: 2 })}</button>
        </div>
      </div>

      <div className="px-6 pb-6 mt-2">
        <p className="text-[#1e2f2f] font-bold text-sm text-center leading-snug whitespace-pre-line">{t('pick.another')}</p>
        <ChatInput placeholder={t('pick.suggestion')} onSubmit={handleSuggestion} className="mt-3"/>
      </div>
    </div>
  </MobileShell>;
}