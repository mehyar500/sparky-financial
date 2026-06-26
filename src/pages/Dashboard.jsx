import React, { useState, useRef, useEffect } from 'react';
import MobileShell from '../components/MobileShell';
import TealButton from '../components/TealButton';
import { CheckSquare, Square, Send, DollarSign, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { getSession, saveSession } from '../lib/onboardingState';
import { base44 } from '../api/base44Client';

function ConfidenceMeter({ score }) {
  return (
    <div className="flex items-center gap-2">
      <Zap size={14} className="text-[#5BC8C8]" />
      <span className="text-xs text-gray-500 font-semibold">Sparky Confidence:</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#5BC8C8] to-[#4ab0b0] rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-[#5BC8C8]">{score}%</span>
    </div>
  );
}

function MissionBanner({ session }) {
  const chosen = session.chosen_option || session.option1 || {};
  const progress = session.progress_percent || 0;
  const done = session.tasks_completed || 0;
  const total = session.total_tasks || 4;
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="text-xs text-gray-400 font-medium">Goal: Earn first ${session.first_goal_amount || 50}</p>
          <p className="text-xs text-[#5BC8C8] font-semibold truncate max-w-[180px]">Path: {chosen.title || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Tasks</p>
          <p className="text-xs font-bold text-[#2c4a4a]">{done}/{total}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#5BC8C8] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-[#5BC8C8]">{progress}%</span>
      </div>
    </div>
  );
}

function TaskList({ tasks, onToggle }) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-bold text-[#5BC8C8] uppercase tracking-wider mb-2">Today's Tasks</p>
      <div className="flex flex-col gap-2">
        {(tasks || []).map((task, i) => (
          <button
            key={task.id}
            onClick={() => onToggle(i)}
            className="flex items-center gap-3 py-2 w-full text-left group"
          >
            {task.done
              ? <CheckSquare size={18} className="text-[#5BC8C8] flex-shrink-0" />
              : <Square size={18} className="text-gray-300 flex-shrink-0 group-hover:text-[#5BC8C8] transition-colors" />
            }
            <span className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-[#2c4a4a]'}`}>{task.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DailyCheckin({ onCheckin }) {
  const options = [
    { id: 'made_progress', label: 'I made progress', emoji: '💪' },
    { id: 'got_stuck', label: 'I got stuck', emoji: '😅' },
    { id: 'no_time', label: "I didn't have time", emoji: '⏰' },
    { id: 'made_money', label: 'I made money! 💰', emoji: '🎉' },
  ];
  return (
    <div className="px-4 py-3 bg-teal-50 border-t border-teal-100">
      <p className="text-xs font-bold text-[#5BC8C8] mb-2">⚡ How did things go today?</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(opt => (
          <button key={opt.id} onClick={() => onCheckin(opt.id)}
            className="bg-white border border-teal-100 rounded-xl py-2 px-2 text-xs font-semibold text-[#2c4a4a] hover:bg-[#5BC8C8] hover:text-white hover:border-[#5BC8C8] transition-all text-center">
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MoneyTracker({ earned, goal, onLog }) {
  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState('');
  const pct = Math.min(100, Math.round((earned / goal) * 100));

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <DollarSign size={14} className="text-[#5BC8C8]" />
          <span className="text-xs font-bold text-[#2c4a4a]">Money Tracker</span>
        </div>
        <button onClick={() => setShowInput(!showInput)} className="text-xs text-[#5BC8C8] font-semibold">+ Log earnings</button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-bold text-gray-600">${earned}/${goal}</span>
      </div>
      {showInput && (
        <div className="flex gap-2 mt-2">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="Amount earned $" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#5BC8C8]" />
          <button onClick={() => { if (amount) { onLog(parseFloat(amount)); setAmount(''); setShowInput(false); } }}
            className="bg-[#5BC8C8] text-white rounded-lg px-3 py-1.5 text-sm font-bold">Log</button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [session, setSession] = useState(getSession() || {});
  const [messages, setMessages] = useState([
    { role: 'sparky', content: `Hey ${(getSession() || {}).name || 'there'}! 👋 I'm here to help you succeed. What's on your mind? You can ask me anything about your plan!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckin, setShowCheckin] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const updateSession = (updates) => {
    const updated = { ...session, ...updates };
    setSession(updated);
    saveSession(updated);
    return updated;
  };

  const handleToggleTask = (idx) => {
    const tasks = [...(session.tasks || [])];
    tasks[idx] = { ...tasks[idx], done: !tasks[idx].done };
    const done = tasks.filter(t => t.done).length;
    const total = tasks.length;
    const pct = Math.round((done / total) * 100);
    const conf = Math.min(100, (session.confidence_score || 30) + (tasks[idx].done ? 10 : -10));
    updateSession({ tasks, tasks_completed: done, progress_percent: pct, confidence_score: conf });
  };

  const handleCheckin = async (status) => {
    setShowCheckin(false);
    const responses = {
      made_progress: `Great progress, ${session.name}! 🌟 Keep it up — every step counts. What did you accomplish today?`,
      got_stuck: `No worries, ${session.name}! Getting stuck is part of the journey. Tell me what's blocking you and I'll help you figure it out! 💪`,
      no_time: `Life happens! 😊 Tomorrow is a fresh start. Even 15 minutes can make progress. What's one tiny thing you could do tomorrow?`,
      made_money: `🎉🎉 AMAZING! You made money! This is HUGE, ${session.name}! Tell me how much and let's celebrate properly!`,
    };
    if (status === 'made_money') setCelebrating(true);
    setMessages(prev => [...prev, { role: 'sparky', content: responses[status] }]);
  };

  const handleLogMoney = async (amount) => {
    const newTotal = (session.money_earned || 0) + amount;
    const goal = session.first_goal_amount || 50;
    updateSession({ money_earned: newTotal, confidence_score: Math.min(100, (session.confidence_score || 30) + 15) });

    let msg = `🎉 YES! You just earned $${amount}! Total so far: $${newTotal}.`;
    if (newTotal >= goal) {
      msg += ` 🏆 YOU HIT YOUR FIRST GOAL OF $${goal}! This is incredible, ${session.name}! You did it!`;
    } else {
      msg += ` You're ${Math.round((newTotal / goal) * 100)}% of the way to your $${goal} goal. Keep going!`;
    }
    setMessages(prev => [...prev, { role: 'sparky', content: msg }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const chosen = session.chosen_option || session.option1 || {};
    const prompt = `You are Sparky, a warm, encouraging AI income coach. 

User context:
- Name: ${session.name}
- Location: ${session.location}
- Current plan: ${chosen.title}
- Action steps: ${(chosen.action_steps || []).join(', ')}
- Tasks completed: ${session.tasks_completed || 0} of ${session.total_tasks || 4}
- Money earned so far: $${session.money_earned || 0} (goal: $${session.first_goal_amount || 50})

The user says: "${userMsg}"

Respond as Sparky — warm, brief (2-4 sentences), action-focused, and encouraging. Use the user's name. If they're struggling, give a specific next step. If they're doing well, celebrate and push forward.`;

    try {
      const resp = await base44.integrations.Core.InvokeLLM({ prompt });
      setMessages(prev => [...prev, { role: 'sparky', content: resp }]);
    } catch {
      setMessages(prev => [...prev, { role: 'sparky', content: `I'm here for you, ${session.name}! Keep pushing forward — you've got this! 💪` }]);
    }
    setLoading(false);
  };

  const conf = session.confidence_score || 30;
  const earned = session.money_earned || 0;
  const goal = session.first_goal_amount || 50;

  return (
    <MobileShell className="flex flex-col">
      {/* Top mission bar — always visible */}
      <MissionBanner session={session} />

      {/* Scrollable middle area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Task list */}
        <TaskList tasks={session.tasks} onToggle={handleToggleTask} />

        {/* Confidence meter */}
        <div className="px-4 pb-2">
          <ConfidenceMeter score={conf} />
        </div>

        {/* Money tracker */}
        <MoneyTracker earned={earned} goal={goal} onLog={handleLogMoney} />

        {/* Daily check-in */}
        {showCheckin && <DailyCheckin onCheckin={handleCheckin} />}

        {/* Chat area */}
        <div className="flex-1 flex flex-col border-t border-gray-100 overflow-hidden">
          <div className="px-4 pt-2 pb-1">
            <p className="text-xs font-bold text-[#5BC8C8] uppercase tracking-wider">Ask Sparky</p>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 pb-2 flex flex-col gap-3 max-h-48">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'sparky' && (
                  <div className="w-6 h-6 rounded-full bg-[#5BC8C8] flex items-center justify-center text-white text-xs mr-1 flex-shrink-0 mt-0.5">S</div>
                )}
                <div className={`rounded-2xl px-3 py-2 max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-[#5BC8C8] text-white rounded-tr-sm' : 'bg-gray-100 text-[#2c4a4a] rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Need help with..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#5BC8C8]"
            />
            <button onClick={handleSend} disabled={loading}
              className="w-9 h-9 rounded-full bg-[#5BC8C8] flex items-center justify-center text-white hover:bg-[#4ab0b0] transition-colors disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}