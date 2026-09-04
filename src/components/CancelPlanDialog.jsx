import React from 'react';
import { Loader2 } from 'lucide-react';
import { useT } from '@/lib/i18n';

export default function CancelPlanDialog({ open, loading, error, onConfirm, onCancel }) {
  const { t } = useT();
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-6" onClick={loading ? undefined : onCancel}>
      <div className="w-full bg-white rounded-3xl p-6 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <p className="text-4xl">😢</p>
        <p className="text-[#183b3b] font-black text-lg mt-2">{t('cancelDialog.title')}</p>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{t('cancelDialog.desc')}</p>
        {error && <p className="text-red-500 text-xs font-bold mt-3">{error}</p>}
        <button onClick={onConfirm} disabled={loading} className="w-full bg-red-500 text-white rounded-full py-3 font-bold text-sm mt-5 disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
          {loading && <Loader2 className="animate-spin" size={16}/>}
          {loading ? t('cancelDialog.canceling') : t('cancelDialog.yes')}
        </button>
        <button onClick={onCancel} disabled={loading} className="w-full bg-teal-50 text-[#287c7c] rounded-full py-3 font-bold text-sm mt-2 hover:bg-teal-100 transition-colors">{t('cancelDialog.keep')}</button>
      </div>
    </div>
  );
}