import React, { useState } from 'react';
import { HOME_HREF } from '@/components/launch/launchDomains';
import { Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useT } from '@/lib/i18n';
import { LAUNCH_COPY } from '@/components/launch/launchContent';

export default function WaitlistPreferences() {
  const { lang } = useT(), copy = LAUNCH_COPY[lang] || LAUNCH_COPY.en;
  const params = new URLSearchParams(window.location.search), token = params.get('token');
  const [busy, setBusy] = useState(false), [status, setStatus] = useState(''), [error, setError] = useState('');
  const act = async action => {
    setBusy(true); setError('');
    try { const { data } = await base44.functions.invoke('manageLaunchWaitlist', { token, action }); setStatus(data.status); }
    catch { setError(copy.invalid); }
    finally { setBusy(false); }
  };
  return <main lang={lang} className="launch-page min-h-screen bg-launch-night text-launch-paper p-5 flex items-center justify-center">
    <section className="w-full max-w-lg rounded-3xl bg-launch-panel border border-launch-mint/20 p-7 md:p-10 text-center">
      <Sparkles className="mx-auto text-launch-mint" size={36} aria-hidden="true"/><p className="mt-4 font-black text-lg">SparkyDollar</p><h1 className="text-3xl font-black mt-6">{copy.manage}</h1>
      <p className="text-launch-soft leading-relaxed mt-4">{token ? copy.manageSub : copy.linkHelp}</p>
      <div role="status" className="text-launch-mint font-bold mt-5">{status === 'confirmed' ? copy.confirmed : status === 'unsubscribed' ? copy.removed : ''}</div>
      {token && status !== 'unsubscribed' && <div className="mt-6 flex flex-col gap-3">
        {params.get('action') !== 'unsubscribe' && status !== 'confirmed' && <button className="launch-button disabled:opacity-60" disabled={busy} onClick={() => act('confirm')}>{busy && <Loader2 size={16} className="animate-spin"/>}{copy.confirm}</button>}
        <button className="min-h-12 border border-launch-mint/40 text-launch-paper font-bold rounded-full px-5 py-3 disabled:opacity-60" disabled={busy} onClick={() => act('unsubscribe')}>{busy ? <Loader2 size={18} className="animate-spin mx-auto"/> : copy.remove}</button>
      </div>}
      {error && <p role="alert" className="text-launch-paper mt-4">{error}</p>}
      <a href={HOME_HREF} className="inline-block underline text-sm text-launch-soft py-4 mt-5">{copy.back}</a>
    </section>
  </main>;
}