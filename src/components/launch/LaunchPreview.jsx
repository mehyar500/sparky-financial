import React from 'react';
import { PREVIEW_IMAGE, PREVIEW_VIDEO } from '@/components/launch/launchContent';

export default function LaunchPreview({ copy }) {
  return <section id="preview" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto scroll-mt-6">
    <div className="text-center max-w-2xl mx-auto"><p className="text-launch-mint text-xs tracking-[.18em] font-extrabold">SPARKYDOLLAR / PREVIEW</p><h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mt-4">{copy.peekTitle}</h2><p className="text-launch-soft mt-4 text-lg">{copy.peekSub}</p></div>
    <figure className="mt-8"><img src={PREVIEW_IMAGE} width="1200" height="900" loading="lazy" alt="SparkyDollar concept screens showing income paths, a next-action checklist, and task progress" className="w-full rounded-3xl"/><figcaption className="text-xs text-launch-soft mt-4 text-center">{copy.illustration}</figcaption></figure>
    <div id="demo" className="mt-20 grid md:grid-cols-[.75fr_1.25fr] items-center gap-8 scroll-mt-6"><div><h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{copy.videoTitle}</h2><p className="mt-4 text-launch-soft leading-relaxed">{copy.videoSub}</p></div><figure><video controls playsInline muted preload="metadata" aria-label={copy.videoTitle} aria-describedby="demo-caption" className="aspect-video w-full rounded-2xl border border-launch-mint/20 bg-launch-panel"><source src={PREVIEW_VIDEO} type="video/mp4"/><a href={PREVIEW_VIDEO}>{copy.demo}</a></video><figcaption id="demo-caption" className="text-xs text-launch-soft mt-3">{copy.videoCaption}</figcaption></figure></div>
  </section>;
}