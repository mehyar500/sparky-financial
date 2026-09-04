import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActivePath, getTasks } from '@/lib/pathData';
import { weeklyInsight } from '@/lib/sparkyAI';
import { useT } from '@/lib/i18n';

async function upgrade(profileId) {
  if (window.self !== window.top) { alert('Checkout works from the published app. Open FirstDollar in a new tab to continue.'); return; }
  const response = await base44.functions.invoke('createCheckout', { origin: window.location.origin, profileId });
  window.location.href = response.data.url;
}

export default function WeeklyReview() {
  const { t } = useT();
  const [state, setState] = useState({ loading: true, profile: null, path: null, tasks: [] });
  const [insight, setInsight] = useState('');

  useEffect(() => { (async () => {
    const [profile, path] = await Promise.all([getMyProfile(), getActivePath()]);
    const tasks = path ? await getTasks(path.id) : [];
    setState({ loading: false, profile, path, tasks });
    if (!profile?.is_paid || !path) return;
    const checkins = await base44.entities.CheckIn.filter({ income_path_id: path.id }, '-check_in_date', 5);
    const note = await weeklyInsight({ profile, path, tasks, checkins });
    setInsight(typeof note === 'string' ? note : String(note?.response || ''));
  })(); }, []);

  const { loading, profile, path, tasks } = state;
  const done = tasks.filter(x => x.status === 'complete').length;

  return <MobileShell>
    <div className="min-h-[680px] bg-gray-50 p-5">
      <Link to="/dashboard" className="text-sm text-[#399d9d]">{t('settings.back')}</Link>
      <h1 className="text-3xl font-black text-[#183b3b] mt-6">{t('weekly.title')}</h1>

      {loading && <div className="flex justify-center pt-16"><Loader2 className="animate-spin text-[#5BC8C8]" size={28}/></div>}

      {!loading && !profile?.is_paid && (
        <div className="bg-white rounded-2xl p-5 mt-6">
          <p className="font-bold text-[#183b3b]">{t('weekly.locked')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('weekly.lockedSub')}</p>
          <button onClick={() => upgrade(profile?.id)} className="mt-4 bg-[#183b3b] text-white rounded-full px-5 py-3 text-sm font-bold">{t('weekly.cta')}</button>
        </div>
      )}

      {!loading && profile?.is_paid && (
        <>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white p-4 rounded-2xl"><b className="text-xl text-[#183b3b]">{done}</b><p className="text-xs text-gray-500">{t('weekly.tasksDone')}</p></div>
            <div className="bg-white p-4 rounded-2xl"><b className="text-xl text-[#183b3b]">{path?.income_total || 0}</b><p className="text-xs text-gray-500">{t('weekly.earned')}</p></div>
          </div>
          <div className="bg-[#183b3b] text-white rounded-2xl p-5 mt-4">
            <p className="text-xs text-[#7dd4d4] font-bold">{t('weekly.noticed')}</p>
            <p className="mt-2 text-sm whitespace-pre-line">{insight || t('weekly.loading')}</p>
          </div>
        </>
      )}
    </div>
  </MobileShell>;
}