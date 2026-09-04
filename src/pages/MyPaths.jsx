import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import WaveHeader from '@/components/WaveHeader';
import SparkyImage from '@/components/SparkyImage';
import PathCard from '@/components/paths/PathCard';
import NewPathSheet from '@/components/paths/NewPathSheet';
import PathSwitchTransition from '@/components/paths/PathSwitchTransition';
import PaywallCTA from '@/components/results/PaywallCTA';
import { base44 } from '@/api/base44Client';
import { clearSession } from '@/lib/onboardingState';
import { getMyProfile, getAllPaths, getActivePathId, setActivePathId } from '@/lib/pathData';
import { useT } from '@/lib/i18n';

export default function MyPaths() {
  const navigate = useNavigate();
  const { t } = useT();
  const [state, setState] = useState({ loading: true, profile: null, paths: [], taskCounts: {} });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [switching, setSwitching] = useState(null);

  useEffect(() => { (async () => {
    const [profile, paths] = await Promise.all([getMyProfile(), getAllPaths()]);
    const taskCounts = {};
    await Promise.all(paths.map(async p => {
      const tasks = await base44.entities.ActionTask.filter({ income_path_id: p.id });
      taskCounts[p.id] = { done: tasks.filter(t => t.status === 'complete').length, total: tasks.length };
    }));
    setState({ loading: false, profile, paths, taskCounts });
  })(); }, []);

  const startNew = () => { clearSession(); navigate('/onboarding/name'); };

  const switchTo = path => {
    setSwitching(path);
    setTimeout(() => { setActivePathId(path.id); navigate('/dashboard'); }, 1500);
  };

  if (state.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  if (switching) return <MobileShell><PathSwitchTransition title={switching.selected_option_json?.title || t('paths.yourPath')}/></MobileShell>;

  const { profile, paths, taskCounts } = state;

  if (!profile?.is_paid) {
    return <MobileShell>
      <div className="flex flex-col min-h-[680px] bg-white">
        <WaveHeader height={80}/>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <SparkyImage pose="excited" size={160}/>
          <p className="text-[#183b3b] font-black text-xl mt-6">{t('paths.plusFeature')}</p>
          <p className="text-gray-500 text-sm mt-2">{t('paths.plusDesc')}</p>
        </div>
        <div className="px-5 pb-4"><PaywallCTA profileId={profile?.id}/></div>
        <Link to="/dashboard" className="text-[#399d9d] text-sm font-bold text-center pb-6">{t('paths.back')}</Link>
      </div>
    </MobileShell>;
  }

  const storedId = getActivePathId();
  const activeId = paths.find(p => p.id === storedId && p.status === 'active')?.id
    || paths.find(p => p.status === 'active')?.id;

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-white">
      <WaveHeader height={80}>
        <p className="text-[#1e5555] font-black text-lg">{t('paths.title')}</p>
      </WaveHeader>
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 bg-gray-50">
        <button onClick={() => setSheetOpen(true)} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3.5 font-bold text-sm hover:bg-[#7dd4d4] transition-colors">{t('paths.startNew')}</button>

        {paths.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-14 px-4">
            <SparkyImage pose="waving" size={160}/>
            <p className="text-[#183b3b] font-black text-lg mt-6">{t('paths.none')}</p>
            <button onClick={startNew} className="mt-5 bg-[#183b3b] text-white rounded-full px-8 py-3 font-bold text-sm">{t('paths.startOnboarding')}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {paths.map(p => (
              <PathCard key={p.id} path={p} counts={taskCounts[p.id]} isActive={p.id === activeId} onSwitch={() => switchTo(p)}/>
            ))}
          </div>
        )}

        <Link to="/dashboard" className="block text-[#399d9d] text-sm font-bold text-center mt-8">{t('paths.back')}</Link>
      </div>
    </div>
    <NewPathSheet open={sheetOpen} onConfirm={startNew} onCancel={() => setSheetOpen(false)}/>
  </MobileShell>;
}