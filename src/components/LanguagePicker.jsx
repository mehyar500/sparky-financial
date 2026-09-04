import React from 'react';
import { LANGUAGES, useT } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';

// The picked language is also stored on the profile, so emails and the coach agent speak it too.
async function persistLanguage(code) {
  try {
    const user = await base44.auth.me();
    const rows = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
    if (rows[0]) await base44.entities.UserProfile.update(rows[0].id, { language: code });
  } catch { /* not signed in yet — onboarding will save it */ }
}

export default function LanguagePicker({ dark = false, className = '' }) {
  const { lang, setLang } = useT();
  const pick = code => { setLang(code); persistLanguage(code); };

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`} role="group" aria-label="Language">
      {LANGUAGES.map(l => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => pick(l.code)}
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