import React from 'react';
import SparkyImage from '@/components/SparkyImage';

export default function PathSwitchTransition({ title }) {
  return (
    <div className="min-h-[680px] bg-[#183b3b] flex flex-col items-center justify-center text-center px-8 animate-in fade-in duration-500">
      <SparkyImage pose="thinking" size={180}/>
      <p className="text-white font-black text-2xl mt-6 leading-snug">Switching to {title}... ⚡</p>
    </div>
  );
}