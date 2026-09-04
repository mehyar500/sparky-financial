import React from 'react';
import { useT } from '@/lib/i18n';

export default function NewPathSheet({ open, onConfirm, onCancel }) {
  const { t } = useT();
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onCancel}>
      <div className="w-full bg-[#183b3b] rounded-t-3xl p-6 text-center" onClick={e => e.stopPropagation()}>
        <p className="text-white font-bold text-lg">{t('paths.sheet.title')}</p>
        <p className="text-white/70 text-sm mt-2">{t('paths.sheet.desc')}</p>
        <button onClick={onConfirm} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3 font-bold mt-5">{t('paths.sheet.yes')}</button>
        <button onClick={onCancel} className="w-full bg-gray-500/30 text-white/80 rounded-full py-3 font-bold mt-2">{t('common.cancel')}</button>
      </div>
    </div>
  );
}