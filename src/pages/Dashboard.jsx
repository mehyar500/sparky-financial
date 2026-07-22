import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, FolderKanban, Loader2, Settings } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import PathHeader from '@/components/workspace/PathHeader';
import TodayFocus from '@/components/workspace/TodayFocus';
import TaskChecklist from '@/components/workspace/TaskChecklist';
import TaskSheet from '@/components/workspace/TaskSheet';
import SparkyChat from '@/components/workspace/SparkyChat';
import CheckInCard from '@/components/workspace/CheckInCard';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActivePath, getTasks, touchPath } from '@/lib/pathData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ loading: true, profile: null, path: null, tasks: [] });
  const [activeTask, setActiveTask] = useState(null);

  const load = async () => {
    const [profile, path] = await Promise.all([getMyProfile(), getActivePath()]);
    if (!path) { navigate('/results'); return; }
    const tasks = await getTasks(path.id);
    setData({ loading: false, profile, path, tasks });
  };
  useEffect(() => { load(); }, []);

  const updateTask = async (task, changes) => {
    await base44.entities.ActionTask.update(task.id, changes);
    const tasks = data.tasks.map(t => t.id === task.id ? { ...t, ...changes } : t);
    const done = tasks.filter(t => t.status === 'complete').length;
    const path = await touchPath(data.path.id, { progress_percentage: Math.round(done / tasks.length * 100) });
    setData(d => ({ ...d, tasks, path }));
    if (activeTask?.id === task.id) setActiveTask({ ...task, ...changes });
  };

  const updatePath = async changes => {
    const path = await touchPath(data.path.id, changes);
    setData(d => ({ ...d, path }));
  };

  if (data.loading) return <MobileShell><div className="min-h-[680px] flex items-center justify-center bg-[#183b3b]"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/></div></MobileShell>;
  const { profile, path, tasks } = data;
  const nextTask = tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.status === 'not_started') || tasks.find(t => t.status === 'blocked');

  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <div className="bg-[#183b3b] px-5 pt-4 flex justify-end gap-4">
      <Link to="/paths" aria-label="My paths"><FolderKanban className="text-white/70" size={19}/></Link>
      <Link to="/weekly-review" aria-label="Weekly review"><CalendarDays className="text-white/70" size={19}/></Link>
      <Link to="/settings" aria-label="Settings"><Settings className="text-white/70" size={19}/></Link>
    </div>
    <PathHeader path={path}/>
    <main className="p-4 space-y-4">
      <CheckInCard profile={profile} path={path} tasks={tasks} nextTask={nextTask} onPathUpdate={updatePath}/>
      <TodayFocus task={nextTask} onOpen={() => setActiveTask(nextTask)}/>
      <TaskChecklist tasks={tasks} onOpen={setActiveTask}/>
      <SparkyChat profile={profile} path={path} tasks={tasks}/>
      <button onClick={() => navigate('/pivot')} className="w-full text-gray-400 text-xs font-bold py-2">I want another path</button>
    </main>
    <TaskSheet task={activeTask} profile={profile} path={path} tasks={tasks} onClose={() => setActiveTask(null)} onUpdate={updateTask}/>
  </div></MobileShell>;
}