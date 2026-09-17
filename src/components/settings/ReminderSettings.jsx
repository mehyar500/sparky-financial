import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useT } from '@/lib/i18n';
import { Switch } from '@/components/ui/switch';

export default function ReminderSettings({ profile, onChange }) {
  const { t } = useT();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const enabled = profile?.daily_nudges_on !== false;
  const toggle = async checked => {
    setBusy(true); setError('');
    try { onChange(await base44.entities.UserProfile.update(profile.id, { daily_nudges_on: checked })); }
    catch { setError(t('settings.error')); }
    finally { setBusy(false); }
  };
  return <section className="mt-4 rounded-2xl bg-background p-5">
    <div className="flex items-center justify-between gap-4">
      <label htmlFor="daily-reminders" className="font-bold text-launch-ink">{t('settings.reminders')}</label>
      <Switch id="daily-reminders" checked={enabled} disabled={!profile || busy} onCheckedChange={toggle} />
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{t('settings.reminderTimes')}</p>
    <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">{t(enabled ? 'settings.remindersOn' : 'settings.remindersOff')}</p>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}