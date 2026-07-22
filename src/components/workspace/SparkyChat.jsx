import React, { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { askSparky } from '@/lib/sparkyAI';

const SUGGESTIONS = ['Help me complete this task', 'Write this for me', 'Help me choose a price', 'Where should I post this?', 'I am stuck', 'Nobody responded', 'I made money', 'I want another path'];

export default function SparkyChat({ profile, path, tasks }) {
  const [conv, setConv] = useState(null), [messages, setMessages] = useState([]), [input, setInput] = useState(''), [loading, setLoading] = useState(false);

  useEffect(() => { if (!path?.id) return; (async () => {
    const rows = await base44.entities.SparkyConversation.filter({ income_path_id: path.id }, '-updated_date', 1);
    if (rows[0]) { setConv(rows[0]); setMessages(rows[0].messages || []); }
  })(); }, [path?.id]);

  const send = async text => {
    if (!text.trim() || loading) return;
    setInput(''); setLoading(true);
    const withUser = [...messages, { role: 'user', content: text }];
    setMessages(withUser);
    const answer = await askSparky(text, { profile, option: path?.selected_option_json, path, tasks, history: withUser });
    const all = [...withUser, { role: 'sparky', content: answer }];
    setMessages(all); setLoading(false);
    const payload = { income_path_id: path.id, messages: all.slice(-40), last_updated: new Date().toISOString() };
    if (conv) await base44.entities.SparkyConversation.update(conv.id, payload);
    else setConv(await base44.entities.SparkyConversation.create(payload));
  };

  return (
    <section className="bg-white rounded-2xl p-4 border border-gray-100">
      <h2 className="font-black text-[#183b3b]">Ask Sparky</h2>
      <div className="flex flex-wrap gap-2 mt-3">{SUGGESTIONS.map(s => <button key={s} onClick={() => send(s)} className="text-[11px] font-bold border border-[#5BC8C8] text-[#287c7c] rounded-full px-3 py-1.5">{s}</button>)}</div>
      {messages.length > 0 && <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
        {messages.slice(-8).map((m, i) => <div key={i} className={`text-sm rounded-xl p-3 whitespace-pre-line ${m.role === 'user' ? 'bg-[#183b3b] text-white ml-8' : 'bg-gray-50 text-gray-600 mr-4'}`}>{m.content}</div>)}
      </div>}
      {loading && <Loader2 className="animate-spin text-[#5BC8C8] mt-3"/>}
      <div className="flex gap-2 mt-4">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Ask Sparky for help with your current plan…" className="min-w-0 flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#5BC8C8]"/>
        <button onClick={() => send(input)} aria-label="Send" className="bg-[#5BC8C8] text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0"><Send size={16}/></button>
      </div>
    </section>
  );
}