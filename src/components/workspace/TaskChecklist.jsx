import React from 'react';
import { AlertCircle, Check, Circle, CircleDashed, SkipForward } from 'lucide-react';

const STATUS = {
  not_started: { label: 'Not started', icon: Circle, cls: 'text-gray-400' },
  in_progress: { label: 'In progress', icon: CircleDashed, cls: 'text-blue-500' },
  complete: { label: 'Complete', icon: Check, cls: 'text-green-600' },
  blocked: { label: 'Blocked', icon: AlertCircle, cls: 'text-amber-500' },
  skipped: { label: 'Skipped', icon: SkipForward, cls: 'text-gray-400' }
};

export default function TaskChecklist({ tasks = [], onOpen }) {
  return (
    <section>
      <p className="text-xs font-black text-[#399d9d] uppercase tracking-wider mb-3">Task Checklist</p>
      <div className="space-y-2">
        {tasks.map(task => {
          const s = STATUS[task.status] || STATUS.not_started;
          const Icon = s.icon;
          return (
            <button key={task.id} onClick={() => onOpen(task)} className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 text-left border border-gray-100">
              <Icon size={18} className={`shrink-0 ${s.cls}`}/>
              <div className="min-w-0 flex-1">
                <p className={`font-bold text-sm text-[#183b3b] ${task.status === 'complete' ? 'line-through opacity-50' : ''}`}>{task.title}</p>
                <p className={`text-[10px] font-bold ${s.cls}`}>{s.label} · {task.estimated_minutes} min · {task.difficulty}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}