import React from 'react';
import MobileShell from '@/components/MobileShell';
import { useT } from '@/lib/i18n';

// Numbered single-choice list used by situation / timeline / hours steps.
export default function PickList({ options, onSelect, note }) {
  const { t } = useT();
  return <MobileShell>
    <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 80 }} />
    <div className="flex-1 flex flex-col justify-center px-6 py-4 gap-1">
      {options.map((opt, i) => (
        <button key={opt.id} onClick={() => onSelect(opt.id)}
          className="w-full py-4 border-b border-gray-100 flex flex-col items-center hover:bg-teal-50 transition-colors rounded-lg active:bg-teal-100">
          <span className="text-[#5BC8C8] font-bold text-sm">{i + 1}.</span>
          <span className="text-[#2c4a4a] font-bold text-base mt-0.5">{t(opt.label)}</span>
        </button>
      ))}
      {note && <p className="text-[#5BC8C8] text-xs text-center mt-6 italic">{t(note)}</p>}
    </div>
    <div className="px-6 pb-6">
      <span className="text-gray-400 text-sm">{t('common.pickOneTell')}</span>
    </div>
  </MobileShell>;
}