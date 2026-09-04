import React from 'react';
import { format } from 'date-fns';
import { useT } from '@/lib/i18n';

const BADGES = {
  active: ['paths.card.active', 'bg-green-100 text-green-700'],
  paused: ['paths.card.paused', 'bg-yellow-100 text-yellow-700'],
  completed: ['paths.card.completed', 'bg-gray-200 text-gray-600'],
  replaced: ['paths.card.paused', 'bg-yellow-100 text-yellow-700']
};

export default function PathCard({ path, counts, isActive, onSwitch }) {
  const { t } = useT();
  const [labelKey, cls] = BADGES[path.status] || BADGES.active;
  const progress = path.progress_percentage || 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[#183b3b] font-black text-lg leading-snug">{path.selected_option_json?.title || t('paths.card.incomePath')}</p>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${cls}`}>{t(labelKey)}</span>
      </div>
      {path.first_goal && <p className="text-[#2c9a9a] font-bold text-sm mt-2">🎯 {path.first_goal}</p>}
      <div className="mt-3">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#5BC8C8] rounded-full transition-all" style={{ width: `${progress}%` }}/>
        </div>
        <p className="text-[#183b3b] text-xs font-bold mt-1">{progress}%</p>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
        <span>✔ {counts?.done ?? 0}/{counts?.total ?? 0} {t('paths.card.tasks')}</span>
        {path.last_activity && <span>{t('paths.card.lastActivity', { date: format(new Date(path.last_activity), 'MMM d') })}</span>}
      </div>
      {isActive
        ? <div className="mt-4 text-center text-xs font-bold text-[#2c9a9a] bg-teal-50 rounded-full py-2.5">{t('paths.card.current')}</div>
        : <button onClick={onSwitch} className="w-full mt-4 bg-[#183b3b] text-white rounded-full py-2.5 text-sm font-bold hover:bg-[#2c4a4a] transition-colors">{t('paths.card.switch')}</button>}
    </div>
  );
}