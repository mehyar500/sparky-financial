import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LAUNCH_AT } from '@/components/launch/launchContent';

export default function LaunchCountdown({ copy }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Date.parse(LAUNCH_AT) - Date.now()));
  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, Date.parse(LAUNCH_AT) - Date.now())), 1000);
    return () => clearInterval(timer);
  }, []);
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24 text-center">
    <div className="rounded-3xl border border-launch-mint/20 bg-launch-panel px-4 py-8 md:flex md:items-center md:justify-between md:px-10 md:text-left">
      <div><p className="text-xs font-bold tracking-[.16em] text-launch-mint">{copy.launch}</p><p className="mt-2 text-launch-soft text-sm">{copy.date}</p></div>
      {remaining > 0 ? <div className="mt-7 flex justify-center gap-5 md:mt-0 md:gap-8" role="timer" aria-label={copy.date}>
        {values.map((value, i) => <div key={i} className="text-center"><p className="text-3xl md:text-4xl font-black tabular-nums text-launch-paper">{String(value).padStart(2, '0')}</p><p className="text-xs text-launch-soft mt-1">{[copy.days, copy.hours, copy.minutes, copy.seconds][i]}</p></div>)}
      </div> : <Link to="/" className="launch-button mt-5 md:mt-0">{copy.open}</Link>}
    </div>
  </section>;
}