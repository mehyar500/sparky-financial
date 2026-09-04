import React from 'react';
import { base44 } from '@/api/base44Client';
import WhatsAppIcon from '@/components/coach/WhatsAppIcon';
import { useT } from '@/lib/i18n';

export default function WhatsAppConnect() {
  const { t } = useT();
  return (
    <div className="rounded-2xl border border-[#DCFCE7] bg-white p-3.5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_0_4px_#DCFCE7]">
          <WhatsAppIcon size={22}/>
        </div>
        <div className="min-w-0">
          <p className="text-[#0F172A] font-bold text-sm leading-tight">{t('coach.wa.title')}</p>
          <p className="text-[#64748B] text-xs mt-0.5 leading-snug">{t('coach.wa.sub')}</p>
        </div>
      </div>
      <a
        href={base44.agents.getWhatsAppConnectURL('task_coach')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 h-[52px] w-full rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_rgba(37,211,102,0.7)] transition-colors"
      >
        <WhatsAppIcon size={20}/> {t('coach.wa.cta')}
      </a>
    </div>
  );
}