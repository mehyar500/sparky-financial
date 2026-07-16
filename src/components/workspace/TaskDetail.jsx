import React from 'react';
import { X } from 'lucide-react';

export default function TaskDetail({ task, onClose }) {
  if (!task) return null;
  const tips = task.tips || (task.tip ? [task.tip] : []);
  return <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
    <div className="w-full max-w-sm bg-white rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto">
      <button onClick={onClose} className="float-right p-2"><X size={20}/></button>
      <p className="text-xs font-bold text-[#5BC8C8] uppercase">Current task</p>
      <h2 className="text-xl font-black text-[#183b3b] mt-2 pr-8">{task.task || task.label}</h2>
      <p className="text-sm text-gray-500 mt-2">About {task.estimated_minutes || 15} minutes</p>
      <h3 className="font-bold text-[#183b3b] mt-6">Sparky tips</h3>
      <ul className="mt-2 space-y-3">{tips.map((tip,i)=><li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-[#5BC8C8]">✓</span>{tip}</li>)}</ul>
    </div>
  </div>;
}