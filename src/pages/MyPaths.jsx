import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Play } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';

const GROUPS = [['active', 'Current Path'], ['paused', 'Paused Paths'], ['completed', 'Completed Paths'], ['replaced', 'Saved Options']];

export default function MyPaths() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState(null);
  useEffect(() => { base44.entities.IncomePath.list('-updated_date').then(setPaths); }, []);

  const resume = async path => {
    const active = (paths || []).find(p => p.status === 'active');
    if (active) await base44.entities.IncomePath.update(active.id, { status: 'paused', reason_paused: 'Switched to another saved path' });
    await base44.entities.IncomePath.update(path.id, { status: 'active', reason_paused: '' });
    navigate('/dashboard');
  };

  if (!paths) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;
  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <div className="bg-[#183b3b] text-white px-5 pt-8 pb-6 rounded-b-3xl"><h1 className="text-2xl font-black">Your paths.</h1><p className="text-white/60 text-sm mt-1">Every path you start stays saved — progress included.</p></div>
    <div className="p-4 space-y-5">
      {GROUPS.map(([status, label]) => {
        const items = paths.filter(p => p.status === status);
        if (!items.length) return null;
        return <section key={status}>
          <p className="text-xs font-black text-[#399d9d] uppercase tracking-wider mb-2">{label}</p>
          <div className="space-y-2">{items.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="font-black text-sm text-[#183b3b]">{p.selected_option_json?.title}</p>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">${p.income_total || 0} earned · {p.progress_percentage || 0}% of tasks</p>
                  {p.reason_paused && <p className="text-[10px] text-gray-400 mt-1">{p.reason_paused}</p>}
                </div>
                {status === 'active'
                  ? <button onClick={() => navigate('/dashboard')} className="text-xs font-bold bg-[#5BC8C8] text-white rounded-full px-3 py-2 shrink-0">Open</button>
                  : status !== 'completed' && <button onClick={() => resume(p)} className="text-xs font-bold border border-[#5BC8C8] text-[#287c7c] rounded-full px-3 py-2 shrink-0 flex items-center gap-1"><Play size={11}/>Resume</button>}
              </div>
            </div>
          ))}</div>
        </section>;
      })}
      <button onClick={() => navigate('/results')} className="w-full border border-gray-300 text-gray-600 rounded-full py-3 font-bold text-sm">View my saved options</button>
    </div>
  </div></MobileShell>;
}