import React from 'react';
import { base44 } from '@/api/base44Client';
import WhatsAppIcon from '@/components/coach/WhatsAppIcon';
import { useT } from '@/lib/i18n';

// Compact always-available WhatsApp entry point for headers.
export default function WhatsAppIconButton({ className = '' }) {
  const { t } = useT();
  return (
    <a
      href={base44.agents.getWhatsAppConnectURL('task_coach')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('coach.wa.cta')}
      title={t('coach.wa.cta')}
      className={`w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_0_3px_rgba(255,255,255,0.45)] hover:bg-[#1EBE5D] transition-colors ${className}`}
    >
      <WhatsAppIcon size={16} />
    </a>
  );
}