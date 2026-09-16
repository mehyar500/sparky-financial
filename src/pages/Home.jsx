import React, { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n';
import { LAUNCH_AT, LAUNCH_COPY } from '@/components/launch/launchContent';
import LaunchNav from '@/components/launch/LaunchNav';
import LaunchHero from '@/components/launch/LaunchHero';
import LaunchCountdown from '@/components/launch/LaunchCountdown';
import LaunchTeasers from '@/components/launch/LaunchTeasers';
import LaunchPreview from '@/components/launch/LaunchPreview';
import LaunchWaitlist from '@/components/launch/LaunchWaitlist';
import LaunchFooter from '@/components/launch/LaunchFooter';

export default function Home() {
  const { lang } = useT(), copy = LAUNCH_COPY[lang] || LAUNCH_COPY.en;
  const [launched, setLaunched] = useState(Date.now() >= Date.parse(LAUNCH_AT));
  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'SparkyDollar — Your next chapter starts with a spark';
    const timer = setInterval(() => setLaunched(Date.now() >= Date.parse(LAUNCH_AT)), 1000);
    return () => { clearInterval(timer); document.title = oldTitle; };
  }, []);
  return <div lang={lang} className="launch-page min-h-screen bg-launch-night text-launch-paper font-body overflow-x-clip">
    <LaunchNav copy={copy} launched={launched}/>
    <main><LaunchHero copy={copy} launched={launched}/><LaunchCountdown copy={copy}/><LaunchTeasers copy={copy}/><LaunchPreview copy={copy}/><LaunchWaitlist copy={copy} launched={launched}/></main>
    <LaunchFooter copy={copy}/>
  </div>;
}