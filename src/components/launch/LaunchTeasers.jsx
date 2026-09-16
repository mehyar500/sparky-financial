import React from 'react';
import { Compass, ListChecks, MessageCircle } from 'lucide-react';
const ICONS = [Compass, ListChecks, MessageCircle];

export default function LaunchTeasers({ copy }) {
  return <section id="how-it-works" className="bg-launch-paper text-launch-ink py-16 md:py-24 px-5 md:px-10 scroll-mt-6">
    <div className="max-w-6xl mx-auto"><p className="text-launch-muted text-xs font-extrabold tracking-[.18em]">{copy.eyebrow}</p><h2 className="mt-4 text-3xl md:text-5xl font-black max-w-2xl tracking-tight leading-tight">{copy.howTitle}</h2>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-12">{copy.steps.map(([number, title, body], i) => { const Icon = ICONS[i]; return <article key={number} className="border-t border-launch-ink/20 pt-7"><div className="flex justify-between items-center"><Icon size={30} className="text-launch-muted" aria-hidden="true"/><span className="text-xs font-bold text-launch-muted">{number}</span></div><h3 className="mt-7 text-xl font-extrabold">{title}</h3><p className="text-launch-muted mt-3 leading-relaxed">{body}</p></article>; })}</div>
    </div>
  </section>;
}