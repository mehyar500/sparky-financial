import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import ChatInput from '@/components/ChatInput';
import CoachMessage from '@/components/coach/CoachMessage';
import { base44 } from '@/api/base44Client';
import { useT } from '@/lib/i18n';

const AGENT = 'task_coach';

export default function TaskCoach() {
  const { t } = useT();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { (async () => {
    const existing = await base44.agents.listConversations({ agent_name: AGENT });
    const conv = existing[0]
      ? await base44.agents.getConversation(existing[0].id)
      : await base44.agents.createConversation({ agent_name: AGENT, metadata: { name: 'Task coach', description: 'Working through pending tasks' } });
    setConversation(conv);
    setMessages(conv.messages || []);
  })(); }, []);

  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, data => setMessages(data.messages));
    return () => unsubscribe();
  }, [conversation?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = content => base44.agents.addMessage(conversation, { role: 'user', content });

  const last = messages[messages.length - 1];
  const waiting = last?.role === 'user';

  return <MobileShell>
    <div className="flex flex-col h-[680px] bg-white">
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%] px-6 pt-4 pb-6 text-center relative flex-shrink-0">
        <Link to="/dashboard" className="absolute left-4 top-4 text-white/90 text-xs font-bold">{t('coach.back')}</Link>
        <p className="text-[#1e5555] font-black text-lg mt-4">{t('coach.title')}</p>
        <p className="text-white text-xs font-semibold">{t('coach.sub')}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!conversation && <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-[#5BC8C8]" size={28}/></div>}
        {conversation && messages.length === 0 && (
          <div className="text-center px-4 pt-6">
            <p className="text-4xl">🤖</p>
            <p className="text-[#2c9a9a] font-bold text-sm mt-3">{t('coach.empty')}</p>
            <div className="flex flex-col gap-2 mt-4">
              {['coach.q1', 'coach.q2', 'coach.q3'].map(k => (
                <button key={k} onClick={() => send(t(k))} className="border border-[#5BC8C8] text-[#2c9a9a] rounded-full py-2 px-4 text-xs font-bold hover:bg-teal-50 transition-colors">{t(k)}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => <CoachMessage key={m.id || i} message={m} />)}
        {waiting && <div className="flex items-center gap-2 text-[#5BC8C8] text-xs font-semibold px-2"><Loader2 className="animate-spin" size={14}/> {t('dash.thinking')}</div>}
        <div ref={bottomRef}/>
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
        <ChatInput placeholder={t('coach.placeholder')} onSubmit={send}/>
        <Link to="/dashboard" className="block text-center text-[#64748B] text-xs font-semibold">{t('coach.back')}</Link>
      </div>
    </div>
  </MobileShell>;
}