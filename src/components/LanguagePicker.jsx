import React from 'react';
import { LANGUAGES, useT } from '@/lib/i18n';

export default function LanguagePicker({ dark = false, className = '' }) {
  const { lang, setLang } = useT();
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`} role="group" aria-label="Language">
      {LANGUAGES.map(l => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            title={l.name}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              active
                ? 'bg-[#5BC8C8] text-[#183b3b]'
                : dark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-[#183b3b]'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}