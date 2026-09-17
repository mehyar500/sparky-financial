import React from 'react';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';
import SparkyAvatar from '@/components/SparkyAvatar';
import { APP_HREF } from '@/components/launch/launchDomains';

export default function LaunchHero({ copy, launched }) {
  return <section className="launch-glow relative mx-auto max-w-7xl px-5 pt-10 pb-16 md:px-10 md:pt-16 md:pb-24 grid lg:grid-cols-[1.25fr_1fr] items-center gap-10">
    <div className="relative z-10">
      <p className="inline-flex items-center gap-2 rounded-full border border-launch-mint/30 bg-launch-mint/10 px-4 py-2 text-xs font-bold text-launch-mint"><Sparkles size={14} aria-hidden="true"/>{launched ? copy.live : copy.soon}</p>
      <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] mt-7 text-balance">{copy.title}<br/><span className="text-launch-mint">{copy.accent}</span></h1>
      <p className="max-w-lg text-launch-soft text-lg leading-relaxed mt-6">{copy.sub}</p>
      <div className="flex flex-wrap gap-4 mt-8 items-center"><a href={launched ? APP_HREF : '#waitlist'} className="launch-button">{launched ? copy.open : copy.join}<ArrowUpRight size={19} aria-hidden="true"/></a><a href="#demo" className="flex items-center gap-2 py-3 px-2 text-sm font-bold text-launch-paper"><span className="w-9 h-9 rounded-full border border-launch-mint/40 flex items-center justify-center"><Play size={14} aria-hidden="true"/></span>{copy.demo}</a></div>
      <p className="text-xs text-launch-soft mt-4">{copy.free}</p>
    </div>
    <div className="relative flex items-center justify-center min-h-[340px] md:min-h-[450px]" aria-hidden="true">
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-dashed border-launch-mint/30"/>
      <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-launch-mint/10 border border-launch-mint/20"/>
      <div className="relative -rotate-6"><SparkyAvatar size={270} expression="excited"/></div>
      <span className="absolute top-5 right-7 text-launch-mint"><Sparkles size={38}/></span>
      <span className="absolute bottom-7 left-2 bg-launch-paper text-launch-ink px-5 py-3 rounded-2xl shadow-xl rotate-3 font-bold text-sm">{copy.steps[1][1]}</span>
      <span className="absolute top-8 left-0 rounded-full bg-launch-mint text-launch-night w-12 h-12 flex items-center justify-center text-2xl font-black">$</span>
    </div>
  </section>;
}