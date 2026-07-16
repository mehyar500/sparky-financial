import React from 'react';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

export default function TaskCard({ task, onToggle, onOpen }) {
  return <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
    <button onClick={onToggle} className="flex gap-3 w-full text-left">
      {task.done ? <CheckCircle2 className="text-[#5BC8C8]" size={20}/> : <Circle className="text-gray-300" size={20}/>} 
      <div className="flex-1"><p className={`font-bold text-sm ${task.done?'line-through text-gray-400':'text-[#183b3b]'}`}>{task.task || task.label}</p>
      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock3 size={11}/>{task.estimated_minutes || 15} min</p></div>
    </button>
    <button onClick={onOpen} className="text-xs text-[#399d9d] font-bold mt-3 ml-8">Open task →</button>
  </div>;
}