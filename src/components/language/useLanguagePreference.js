import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { getLang, getPreference, rememberLanguage } from '@/lib/languagePreference';

export default function useLanguagePreference() {
  const { user } = useAuth();
  const [lang, setLanguage] = useState(getLang), [preference, setPreference] = useState(getPreference);
  const [error, setError] = useState(''), [saving, setSaving] = useState(false);
  const revision = useRef(0);
  const apply = code => { setPreference(code); const language = rememberLanguage(code); setLanguage(language); return language; };
  useEffect(() => {
    let canceled = false;
    const version = revision.current;
    if (!user?.id) { apply(getPreference()); return; }
    (async () => {
      const rows = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
      if (canceled || version !== revision.current) return;
      const profile = rows[0];
      const choice = profile?.language_preference || profile?.language || getPreference();
      const language = apply(choice);
      if (profile && profile.language !== language) await base44.entities.UserProfile.update(profile.id, { language });
    })();
    return () => { canceled = true; };
  }, [user?.id]);
  const setLang = async code => {
    revision.current += 1;
    const previous = preference;
    const language = apply(code);
    setError(''); setSaving(true);
    try {
      if (user?.id) {
        const rows = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
        if (rows[0]) await base44.entities.UserProfile.update(rows[0].id, { language, language_preference: code });
      }
    } catch (e) { apply(previous); setError(e.message); }
    finally { setSaving(false); }
  };
  useEffect(() => {
    const changed = () => { if (preference === 'auto') setLang('auto'); };
    window.addEventListener('languagechange', changed);
    return () => window.removeEventListener('languagechange', changed);
  }, [preference, user?.id]);
  return { lang, preference, setLang, error, saving };
}