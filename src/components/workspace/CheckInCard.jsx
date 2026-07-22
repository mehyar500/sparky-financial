import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { askSparky } from '@/lib/sparkyAI';

const RESPONSES = [['made_progress', 'I made progress'], ['completed_task', 'I completed the task'], ['got_stuck', 'I got stuck'], ['no_time', 'I did not have time'], ['made_money', 'I made money'], ['change_paths', 'I want to change paths']];
const MILESTONES = [['First Dollar', 1], ['First $25', 25], ['First $50', 50], ['First $100', 100]];

export default function CheckInCard({ profile, path, tasks, nextTask, onPathUpdate }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [done, setDone] = useState(path.last_check_in === today);
  const [askMoney, setAskMoney] = useState(false), [amount, setAmount] = useState(''), [reply, setReply] = useState(''), [loading, setLoading] = useState(false);

  const finish = async (response, earned = 0) => {
    setLoading(true);
    const action = await askSparky(`Daily check-in: the user says "${response}"${earned ? ` and earned $${earned}` : ''}. Respond with one empathetic sentence and one small specific next action. Celebrate real progress without exaggeration.`, { profile, option: path.selected_option_json, path, tasks });
    await base44.entities.CheckIn.create({ income_path_id: path.id, check_in_date: today, progress_response: response, amount_earned: earned || undefined, next_recommended_action: action });
    const changes = { last_check_in: today };
    if (earned) {
      const total = (path.income_total || 0) + earned;
      changes.income_total = total;
      changes.milestone_history = [...(path.milestone_history || []), ...MILESTONES.filter(([label, n]) => total >= n && !(path.milestone_history || []).some(m => m.label === label)).map(([label]) => ({ label, date: today }))];
    }
    await onPathUpdate(changes);
    setReply(action); setLoading(false); setDone(true); setAskMoney(false);
  };

  const respond = key => {
    if (key === 'change_paths') { navigate('/pivot'); return; }
    if (key === 'made_money') { setAskMoney(true); return; }
    finish(key);
  };

  if (done && !reply) return null;
  return (
    <section className="bg-white rounded-2xl p-4 border border-gray-100">
      {!done && !askMoney && <>
        <h2 className="font-black text-[#183b3b]">Welcome back, {profile?.name || 'there'}.</h2>
        <p className="text-sm text-gray-500 mt-1">{nextTask ? `Last time, you were working on "${nextTask.title}". How did it go?` : 'How did it go since last time?'}</p>
        <div className="grid grid-cols-2 gap-2 mt-3">{RESPONSES.map(([k, l]) => <button key={k} onClick={() => respond(k)} disabled={loading} className="rounded-xl p-2.5 text-xs font-bold border border-gray-200 text-gray-600 hover:border-[#5BC8C8]">{l}</button>)}</div>
      </>}
      {askMoney && <>
        <h2 className="font-black text-[#183b3b]">How much did you earn from this path?</h2>
        <div className="flex gap-2 mt-3">
          <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="$ amount" className="min-w-0 flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"/>
          <button onClick={() => finish('made_money', Number(amount) || 0)} disabled={!amount || loading} className="bg-[#5BC8C8] disabled:opacity-40 text-white rounded-xl px-4 font-bold text-sm">Log it</button>
        </div>
      </>}
      {loading && <Loader2 className="animate-spin text-[#5BC8C8] mt-3"/>}
      {reply && <p className="text-sm text-gray-600 bg-teal-50 rounded-xl p-3 mt-3 whitespace-pre-line">{reply}</p>}
    </section>
  );
}