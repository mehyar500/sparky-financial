import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import WhatsAppIcon from '@/components/coach/WhatsAppIcon';
import { base44 } from '@/api/base44Client';
import { getSession, saveSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function WhatsAppStep() {
  const navigate = useNavigate();
  const { t } = useT();
  const next = optIn => {
    saveSession({ ...(getSession() || {}), whatsapp_opt_in: optIn, whatsapp_prompted: true });
    navigate('/onboarding/processing');
  };

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-[#F8FAF9]">
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-7 flex-1 pt-6 pb-4 text-center">
        <p className="text-[#0F172A] font-black text-xl leading-snug">{t('waStep.title')}</p>
        <p className="text-[#64748B] text-sm font-semibold mt-2 leading-snug">{t('waStep.sub')}</p>
        <div className="flex-1 flex items-center justify-center"><SparkyAvatar size={130} expression="waving" /></div>
        <div className="w-full rounded-2xl border border-[#DCFCE7] bg-white p-3.5 text-left">
          {['waStep.b1', 'waStep.b2', 'waStep.b3'].map(k => (
            <div key={k} className="flex items-start gap-2 py-1">
              <span className="text-[#25D366] mt-0.5"><WhatsAppIcon size={14} /></span>
              <p className="text-[#0F172A] text-xs font-semibold leading-snug">{t(k)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 space-y-3">
        <a
          href={base44.agents.getWhatsAppConnectURL('task_coach')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => next(true)}
          className="h-[52px] w-full rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_rgba(37,211,102,0.7)] transition-colors"
        >
          <WhatsAppIcon size={20} /> {t('waStep.connect')}
        </a>
        <button onClick={() => next(false)} className="w-full text-[#64748B] text-xs font-bold">{t('waStep.skip')}</button>
      </div>
    </div>
  </MobileShell>;
}