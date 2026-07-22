import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { askSparky } from '@/lib/sparkyAI';

export default function TaskSheet({ task, profile, path, tasks, onClose, onUpdate }) {
  const [help, setHelp] = useState(''), [loading, setLoading] = useState(false);
  if (!task) return null;
  const option = path?.selected_option_json || {};

  const needHelp = async stuck => {
    setLoading(true);
    if (stuck) await onUpdate(task, { status: 'blocked', blocker_reason: 'User got stuck' });
    const answer = await askSparky(stuck ? `I got stuck on this task: "${task.title}". Help me get unstuck.` : `I need help completing this task: "${task.title}". ${task.description}`, { profile, option, path, tasks });
    setHelp(answer); setLoading(false);
  };

  return (
    <div className="absolute inset-0 z-30 bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85%] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start gap-3">
          <h2 className="font-black text-lg text-[#183b3b]">{task.title}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} className="text-gray-400"/></button>
        </div>
        <p className="text-xs font-bold text-[#399d9d] mt-1">{task.estimated_minutes} min · {task.difficulty}</p>
        <p className="text-sm text-gray-600 mt-3">{task.description}</p>
        <div className="bg-teal-50 rounded-xl p-3 mt-3"><p className="text-xs text-[#287c7c]"><span className="font-bold">Why it matters:</span> {task.why_it_matters}</p></div>
        {task.instructions?.length > 0 && <ol className="mt-3 space-y-2">{task.instructions.map((s, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="font-black text-[#5BC8C8]">{i + 1}.</span>{s}</li>)}</ol>}
        {loading && <Loader2 className="animate-spin text-[#5BC8C8] mt-4"/>}
        {help && <p className="text-sm whitespace-pre-line text-gray-600 bg-gray-50 rounded-xl p-3 mt-4">{help}</p>}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={() => onUpdate(task, { status: 'complete', completed_at: new Date().toISOString() })} className="bg-[#5BC8C8] text-white rounded-full py-3 font-bold text-sm">Mark Complete</button>
          <button onClick={() => needHelp(false)} className="border border-[#5BC8C8] text-[#287c7c] rounded-full py-3 font-bold text-sm">I Need Help</button>
          <button onClick={() => needHelp(true)} className="border border-amber-400 text-amber-600 rounded-full py-3 font-bold text-sm">I Got Stuck</button>
          <button onClick={() => { onUpdate(task, { status: 'skipped' }); onClose(); }} className="border border-gray-300 text-gray-500 rounded-full py-3 font-bold text-sm">Skip for Now</button>
        </div>
        {task.status !== 'in_progress' && task.status !== 'complete' && <button onClick={() => onUpdate(task, { status: 'in_progress' })} className="w-full text-gray-400 text-xs font-bold py-3">Mark as in progress</button>}
      </div>
    </div>
  );
}