import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

function ToolCall({ toolCall }) {
  const failed = ['failed', 'error'].includes(toolCall.status) || /error|failed/i.test(String(toolCall.results || ''));
  const running = ['pending', 'running', 'in_progress'].includes(toolCall.status);
  const p = toolCall.display_projection;
  const label = p ? (running ? p.active_label : failed ? p.error_label : p.label) : toolCall.name?.replace(/_/g, ' ');
  const Icon = running ? Loader2 : failed ? XCircle : CheckCircle2;
  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-semibold mt-1.5 ${failed ? 'text-red-400' : 'text-[#5BC8C8]'}`}>
      <Icon size={12} className={running ? 'animate-spin' : ''} /> {label}
    </div>
  );
}

export default function CoachMessage({ message }) {
  const isUser = message.role === 'user';
  if (!message.content && !message.tool_calls?.length) return null;
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? 'bg-teal-50 text-[#2c4a4a] font-semibold' : 'bg-gray-50 border border-gray-100 text-[#1e2f2f]'}`}>
        {message.content && (isUser
          ? <p className="whitespace-pre-line">{message.content}</p>
          : <ReactMarkdown className="prose prose-sm max-w-none leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1">{message.content}</ReactMarkdown>)}
        {message.tool_calls?.map((tc, i) => <ToolCall key={i} toolCall={tc} />)}
      </div>
    </div>
  );
}