import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

export default function TodayFocus({ task, onOpen }) {
  if (!task) return (
    <section className="bg-[#5BC8C8] text-white rounded-2xl p-4">
      <p className="text-xs font-black uppercase tracking-wider">Today's Focus</p>
      <p className="font-black mt-1">All starter tasks handled — log your earnings or ask Sparky what's next.</p>
    </section>
  );
  return (
    <button onClick={onOpen} className="w-full bg-[#5BC8C8] text-white rounded-2xl p-4 text-left">
      <p className="text-xs font-black uppercase tracking-wider">Today's Focus</p>
      <div className="flex justify-between items-center mt-1 gap-3">
        <p className="font-black">{task.title}</p>
        <ArrowRight size={18} className="shrink-0"/>
      </div>
      <p className="text-xs text-white/80 mt-1 flex items-center gap-1"><Clock size={12}/>{task.estimated_minutes} min · {task.difficulty}</p>
    </button>
  );
}