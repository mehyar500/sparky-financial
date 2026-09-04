import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useT } from '@/lib/i18n';

export default function NudgeCard({ profileId }) {
  const { t } = useT();
  const [nudge, setNudge] = useState(null);

  useEffect(() => { (async () => {
    if (!profileId) return;
    const list = await base44.entities.CoachNudge.filter({ profile_id: profileId, dismissed: false }, '-created_date', 1);
    setNudge(list[0] || null);
  })(); }, [profileId]);

  if (!nudge) return null;

  const dismiss = async () => {
    await base44.entities.CoachNudge.update(nudge.id, { dismissed: true });
    setNudge(null);
  };

  return (
    <div className="mx-5 mt-4 rounded-2xl border border-[#DCFCE7] bg-white p-3.5 relative">
      <button onClick={dismiss} aria-label={t('nudge.close')} className="absolute right-2.5 top-2.5 text-[#64748B]"><X size={14} /></button>
      <p className="text-[#25D366] text-[11px] font-black uppercase tracking-wide">
        {nudge.kind === 'morning' ? t('nudge.morning') : t('nudge.checkin')}
      </p>
      <p className="text-[#0F172A] text-sm font-semibold leading-snug mt-1 pr-4 whitespace-pre-line">{nudge.message}</p>
    </div>
  );
}