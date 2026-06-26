import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const STATUS_STYLES = {
  made_progress: { bg: 'bg-[#5BC8C8]', emoji: '💪' },
  made_money:    { bg: 'bg-green-500',  emoji: '💰' },
  got_stuck:     { bg: 'bg-yellow-400', emoji: '😅' },
  no_time:       { bg: 'bg-gray-300',   emoji: '⏰' },
};

function getCheckinHistory() {
  try {
    return JSON.parse(localStorage.getItem('fd_checkin_history') || '{}');
  } catch { return {}; }
}

export function saveCheckinToHistory(dateStr, status) {
  const history = getCheckinHistory();
  history[dateStr] = status;
  localStorage.setItem('fd_checkin_history', JSON.stringify(history));
}

function computeStreak(history) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (history[key]) streak++;
    else break;
  }
  return streak;
}

export default function StreakCalendar({ checkinHistory: externalHistory }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const history = externalHistory || getCheckinHistory();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const streak = computeStreak(history);
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const todayStr = today.toISOString().slice(0, 10);

  return (
    <div className="px-4 py-3 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-bold text-[#2c4a4a]">Check-in Streak</span>
          <span className="ml-1 bg-orange-100 text-orange-500 text-xs font-bold px-1.5 py-0.5 rounded-full">{streak} 🔥</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-0.5 rounded hover:bg-gray-100 transition-colors">
            <ChevronLeft size={14} className="text-gray-400" />
          </button>
          <span className="text-xs font-semibold text-gray-500 w-20 text-center">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-0.5 rounded hover:bg-gray-100 transition-colors">
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-gray-400 font-semibold">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const status = history[dateStr];
          const isToday = dateStr === todayStr;
          const style = status ? STATUS_STYLES[status] : null;

          return (
            <div key={dateStr} className="flex items-center justify-center">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                ${style ? style.bg + ' text-white' : isToday ? 'border-2 border-[#5BC8C8] text-[#5BC8C8]' : 'text-gray-400'}
              `}>
                {status ? style.emoji : day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-2 flex-wrap">
        {Object.entries(STATUS_STYLES).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${val.bg}`} />
            <span className="text-[10px] text-gray-400 capitalize">{key.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}