import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import SparkyImage from '@/components/SparkyImage';
import { base44 } from '@/api/base44Client';
import { getSession } from '@/lib/onboardingState';
import { getMyProfile, getActiveRecSet, getActivePath, getTasks, startPath } from '@/lib/pathData';
import { useT } from '@/lib/i18n';

export default function ActionPlan() {
  const navigate = useNavigate();
  const { t } = useT();
  const [state, setState] = useState({ loading: true, building: false, path: null, tasks: [] });
  const [step, setStep] = useState('overview'); // 'overview' | 'pick'
  const chosen = (getSession() || {}).chosen_option || {};

  useEffect(() => { (async () => {
    const [profile, recSet, existing] = await Promise.all([getMyProfile(), getActiveRecSet(), getActivePath()]);
    let path = existing;
    if (path && chosen.title && path.selected_option_json?.title !== chosen.title) path = null;
    if (!path) {
      if (!chosen.title) { navigate('/results'); return; }
      setState(s => ({ ...s, building: true }));
      path = await startPath(recSet, chosen, profile);
    }
    const tasks = await getTasks(path.id);
    setState({ loading: false, building: false, path, tasks });
  })(); }, []);

  const pickTask = async task => {
    await base44.entities.ActionTask.update(task.id, { status: 'in_progress' });
    navigate('/dashboard');
  };

  if (state.building) {
    return <MobileShell>
      <div className="flex flex-col min-h-[680px] bg-white">
        <WaveHeader height={80}/>
        <div className="flex flex-col items-center flex-1 justify-center px-8 text-center pb-10">
          <p className="text-[#5BC8C8] font-bold text-base">{t('plan.moment')}</p>
          <p className="text-[#1e2f2f] font-black text-xl mt-3 leading-snug">{t('plan.building')}</p>
          <SparkyImage pose="thinking" size={200} className="mt-8"/>
        </div>
      </div>
    </MobileShell>;
  }
  if (state.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#2c4a4a]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  const { path, tasks } = state;
  const option = path.selected_option_json || {};
  const optNum = option.option_number || 1;

  if (step === 'pick') {
    return <MobileShell>
      <div className="flex flex-col min-h-[680px] bg-white">
        <WaveHeader height={80}/>
        <div className="flex-1 flex flex-col justify-center px-8 py-4 gap-1">
          {tasks.map((t, i) => (
            <button key={t.id} onClick={() => pickTask(t)} className="w-full py-3.5 border-b border-gray-100 flex flex-col items-center hover:bg-teal-50 transition-colors rounded-lg">
              <span className="text-[#5BC8C8] font-bold text-sm">{i + 1}.</span>
              <span className="text-[#2c4a4a] font-semibold text-sm mt-0.5 leading-snug">{t.title}</span>
            </button>
          ))}
        </div>
        <div className="px-6 pb-6">
          <button onClick={() => navigate('/dashboard')} className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-400 text-center hover:border-[#5BC8C8] transition-colors">{t('plan.pickOne')}</button>
        </div>
      </div>
    </MobileShell>;
  }

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#2c4a4a]">
      <WaveHeader height={70}>
        <p className="text-[#1e5555] font-bold text-sm text-center">{t('common.option', { n: optNum })} / {option.title}</p>
      </WaveHeader>
      <div className="flex flex-col flex-1 px-6 pt-5 pb-6 overflow-y-auto">
        <div className="text-center">
          <p className="text-white font-black text-xl">{t('plan.firstGoal')}</p>
          <ChevronDown className="text-[#5BC8C8] mx-auto mt-0.5" size={18}/>
          <p className="text-white font-bold text-lg mt-1">{t('plan.earn', { amount: path.first_goal_amount || 100 })}</p>
        </div>

        <div className="bg-[#1e3535] rounded-2xl p-4 mt-6">
          <p className="text-[#5BC8C8] text-sm font-bold text-center">{t('plan.checklist')}</p>
          <ChevronDown className="text-[#5BC8C8] mx-auto mt-1 mb-2" size={16}/>
          <div className="flex flex-col gap-2.5">
            {tasks.map(t => (
              <div key={t.id} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-sm bg-[#5BC8C8] mt-1.5 flex-shrink-0"/>
                <p className="text-white font-bold text-sm leading-snug">{t.title}</p>
              </div>
            ))}
          </div>
          {path.tip && <p className="text-gray-400 text-xs text-center mt-4 italic">{t('plan.tip')}<br/>"{path.tip}"</p>}
        </div>

        <div className="mt-auto pt-5">
          <button onClick={() => setStep('pick')} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3.5 font-bold hover:bg-[#7dd4d4] transition-colors">{t('plan.start')}</button>
        </div>
      </div>
    </div>
  </MobileShell>;
}