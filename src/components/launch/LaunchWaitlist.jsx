import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { APP_HREF } from '@/components/launch/launchDomains';

export default function LaunchWaitlist({ copy, launched }) {
  const [email, setEmail] = useState(''), [consent, setConsent] = useState(false), [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false), [saved, setSaved] = useState(false), [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault(); if (busy) return; setBusy(true); setError('');
    try { await base44.functions.invoke('joinLaunchWaitlist', { email, consent, website }); setSaved(true); }
    catch { setError(copy.error); }
    finally { setBusy(false); }
  };
  return <section id="waitlist" className="px-5 md:px-10 py-16 md:py-24 bg-launch-mint text-launch-ink scroll-mt-6">
    <div className="max-w-xl mx-auto text-center"><h2 className="text-4xl md:text-5xl tracking-tight font-black leading-tight">{launched ? copy.live : copy.waitTitle}</h2><p className="mt-4 leading-relaxed">{launched ? copy.sub : copy.waitSub}</p>
      {launched ? <a href={APP_HREF} className="inline-flex items-center justify-center mt-8 bg-launch-night text-launch-paper px-7 py-4 rounded-full font-bold">{copy.open}<ArrowUpRight size={19}/></a> : saved ? <div role="status" className="mt-8 bg-launch-paper rounded-2xl p-6"><CheckCircle2 className="mx-auto mb-3" size={30}/><h3 className="font-extrabold text-xl">{copy.saved}</h3><p className="mt-2 text-sm leading-relaxed text-launch-muted">{copy.savedSub}</p></div> : <form onSubmit={submit} className="text-left mt-8">
        <label htmlFor="launch-email" className="font-bold text-sm">{copy.email}</label>
        <div className="flex flex-col sm:flex-row gap-2 mt-2"><input id="launch-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" aria-describedby={error ? 'waitlist-error' : 'launch-consent'} className="min-w-0 flex-1 bg-launch-paper text-launch-ink rounded-xl px-4 py-4 border border-launch-ink/30"/><button type="submit" disabled={busy || !consent} className="bg-launch-night text-launch-paper font-bold px-5 py-4 rounded-xl disabled:opacity-60 flex justify-center items-center gap-2">{busy ? <Loader2 className="animate-spin" size={18}/> : <ArrowUpRight size={18}/>} {busy ? copy.sending : copy.join}</button></div>
        <div className="hidden" aria-hidden="true"><label htmlFor="launch-website">Website</label><input id="launch-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></div>
        <label id="launch-consent" className="mt-4 flex items-start gap-3 text-xs leading-relaxed cursor-pointer py-2"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 shrink-0"/>{copy.consent}</label>
        {error && <p id="waitlist-error" role="alert" className="mt-3 text-sm font-bold">{error}</p>}
      </form>}
      <Link to="/privacy" className="inline-block py-3 mt-3 text-xs underline">{copy.privacy}</Link>
    </div>
  </section>;
}