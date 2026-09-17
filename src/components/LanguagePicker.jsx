import React from 'react';
import { LANGUAGES, useT } from '@/lib/i18n';


export default function LanguagePicker({ dark = false, className = '' }) {
  const { preference, setLang, saving, error, t } = useT();
  const choices = [{ code: 'auto', label: t('language.auto'), name: t('language.autoHint') }, ...LANGUAGES];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 ${className}`} role="group" aria-label="Language">
      {choices.map(l => {
        const active = l.code === preference;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            disabled={saving}
            aria-pressed={active}
            title={l.name}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              active
                ? 'bg-[#5BC8C8] text-[#183b3b]'
                : dark ? 'text-launch-soft hover:text-launch-paper' : 'text-launch-muted hover:text-launch-ink'
            }`}
          >
            {l.label}
          </button>
        );
      })}
      {error && <p role="alert" className="basis-full text-xs text-destructive">{error}</p>}
    </div>
  );
}