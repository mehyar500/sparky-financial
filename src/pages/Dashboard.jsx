import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2, Settings } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import ChatInput from '@/components/ChatInput';
import ChangeOptionDialog from '@/components/ChangeOptionDialog';
import { base44 } from '@/api/base44Client';
import { askSparky } from '@/lib/sparkyAI';
import { getMyProfile, getActivePath, getTasks, touchPath } from '@/lib/pathData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ loading: true, profile: null, path: null, tasks: [] });
  const [chat, setChat] = useState(null); // { question, answer, loading }
  const [changeOpen, setChangeOpen] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => { (async () => {
    const [profile, path] = await Promise.all([getMyProfile(), getActivePath()]);
    if (!path) { navigate('/results'); return; }
    const tasks = await getTasks(path.id);
    setData({ loading: false, profile, path, tasks });
  })(); }, []);

  const markDone = async task => {
    await base44.entities.ActionTask.update(task.id, { status: 'complete', completed_at: new Date().toISOString() });
    const tasks = data.tasks.map(t => t.id === task.id ? { ...t, status: 'complete' } : t);
    const done = tasks.filter(t => t.status === 'complete').length;
    const path = await touchPath(data.path.id, { progress_percentage: Math.round(done / tasks.length * 100) });
    setData(d => ({ ...d, tasks, path }));
    setChat(null);
  };

  const confirmChange = async () => {
    setChanging(true);
    await touchPath(data.path.id, { status: 'paused', reason_paused: 'User wants different options' });
    navigate('/results');
  };

  const ask = async question => {
    setChat({ question, loading: true });
    const answer = await askSparky(question, {
      profile: data.profile,
      option: data.path.selected_option_json,
      path: data.path,
      tasks: data.tasks
    });
    setChat({ question, answer, loading: false });
  };

  if (data.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;

  const { path, tasks } = data;
  const focus = tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.status === 'not_started');
  const progress = path.progress_percentage || 0;

  return <MobileShell>
    <div className="flex flex-col min-h-[680px] bg-white">
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%] px-6 pt-5 pb-8 text-center relative flex-shrink-0">
        <Link to="/settings" aria-label="Settings" className="absolute right-4 top-4"><Settings size={17} className="text-white/80"/></Link>
        <p className="text-[#1e5555] font-black text-lg">Progress {progress}%</p>
        <ChevronDown className="text-[#1e5555] mx-auto" size={16}/>
        <p className="text-white font-bold text-sm mt-0.5">Week 1 Goal: Earn ${path.first_goal_amount || 100}</p>
      </div>

      <div className="px-6 mt-5 text-center">
        <p className="text-[#2c9a9a] font-black text-base leading-snug">🔥 Focus Today: {focus ? focus.title : 'All tasks complete! Great work.'}</p>
      </div>

      {focus && (
        <div className="mx-5 mt-4 bg-[#2c4a4a] rounded-2xl p-4">
          <div className="flex flex-col gap-2">
            {(focus.instructions || [focus.description]).filter(Boolean).map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-sm bg-[#5BC8C8] mt-1.5 flex-shrink-0"/>
                <p className="text-white text-sm leading-snug">{s}</p>
              </div>
            ))}
          </div>
          <button onClick={() => markDone(focus)} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-2.5 text-sm font-bold mt-4 hover:bg-[#7dd4d4] transition-colors">Mark this task done</button>
        </div>
      )}

      <div className="mt-auto px-5 pb-6 pt-5">
        {chat && (
          <div className="mb-3 space-y-2">
            <p className="text-[#2c4a4a] text-sm font-semibold bg-teal-50 rounded-2xl px-4 py-2.5">{chat.question}</p>
            {chat.loading
              ? <div className="flex items-center gap-2 text-[#5BC8C8] text-xs font-semibold px-2"><Loader2 className="animate-spin" size={14}/> Sparky is thinking...</div>
              : <p className="text-[#1e2f2f] text-sm leading-relaxed bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 whitespace-pre-line">{chat.answer}</p>}
          </div>
        )}
        <p className="text-[#5BC8C8] text-sm font-bold text-center mb-2.5">🤖 Ask Sparky for help with your current plan…</p>
        <ChatInput placeholder="Need help with..." onSubmit={ask}/>
        <button onClick={() => setChangeOpen(true)} className="w-full text-[#5BC8C8] text-xs font-bold text-center mt-4">↩ I want a different option 🤖</button>
      </div>
    </div>
    <ChangeOptionDialog open={changeOpen} loading={changing} onConfirm={confirmChange} onCancel={() => setChangeOpen(false)}/>
  </MobileShell>;
}