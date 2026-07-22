import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MobileShell from '@/components/MobileShell';
import { base44 } from '@/api/base44Client';
import { getMyProfile, getActiveRecSet } from '@/lib/pathData';
import { generateOptions } from '@/lib/sparkyAI';

const REASONS = ['I want something faster', 'I want something fully remote', 'I want less social interaction', 'I want something easier', 'I want greater income potential', 'I cannot spend money to begin', 'I want to use a different skill', 'I do not like either idea', 'Other'];

export default function DifferentOptions() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]), [text, setText] = useState(''), [loading, setLoading] = useState(false), [error, setError] = useState('');
  const toggle = r => setSelected(s => s.includes(r) ? s.filter(x => x !== r) : [...s, r]);

  const regenerate = async () => {
    setLoading(true); setError('');
    try {
      const [profile, recSet] = await Promise.all([getMyProfile(), getActiveRecSet()]);
      const previouslyRejected = recSet?.rejected_options || [];
      const rejected = [...previouslyRejected, recSet?.option_1_json, recSet?.option_2_json].filter(Boolean);
      const reason = selected.join('; ');
      const result = await generateOptions(profile, { rejected, reason, preferences: text });
      if (recSet) await base44.entities.RecommendationSet.update(recSet.id, { status: 'rejected' });
      await base44.entities.RecommendationSet.create({
        option_1_json: result.option_1, option_2_json: result.option_2,
        rejected_options: rejected, request_for_alternatives: `${reason}${text ? ` — ${text}` : ''}`,
        date_generated: new Date().toISOString(), status: 'active'
      });
      navigate('/results');
    } catch (e) { setError(e.message || 'Could not generate new options.'); setLoading(false); }
  };

  if (loading) return <MobileShell><div className="min-h-[680px] flex flex-col items-center justify-center bg-[#183b3b] text-white p-8 text-center"><Loader2 className="animate-spin text-[#5BC8C8]" size={32}/><p className="font-bold mt-4">Finding two new paths that match what you asked for...</p></div></MobileShell>;

  return <MobileShell><div className="min-h-[680px] bg-gray-50 pb-8">
    <div className="bg-[#183b3b] text-white px-5 pt-8 pb-6 rounded-b-3xl"><h1 className="text-2xl font-black">What would you like to change?</h1><p className="text-white/60 text-sm mt-1">Pick everything that applies.</p></div>
    <div className="p-4">
      <div className="flex flex-wrap gap-2">{REASONS.map(r => <button key={r} onClick={() => toggle(r)} className={`text-xs font-bold rounded-full px-3.5 py-2.5 border ${selected.includes(r) ? 'bg-[#5BC8C8] text-white border-[#5BC8C8]' : 'bg-white text-gray-600 border-gray-200'}`}>{r}</button>)}</div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tell Sparky what you would prefer." rows={3} className="w-full mt-4 bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-[#5BC8C8]"/>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <button onClick={regenerate} disabled={!selected.length && !text.trim()} className="w-full bg-[#5BC8C8] disabled:opacity-40 text-white rounded-full py-3.5 font-bold mt-4">Show Me Two New Options</button>
      <button onClick={() => navigate('/results')} className="w-full text-gray-500 text-sm font-bold py-3 mt-1">Keep my current options</button>
    </div>
  </div></MobileShell>;
}