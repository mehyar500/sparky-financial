import React, { useEffect, useState } from 'react';
import { LocateFixed, Loader2, MapPin } from 'lucide-react';

const displayName = item => {
  const a = item.address || {};
  return [a.city || a.town || a.village || a.county, a.state, a.postcode, a.country].filter(Boolean).join(', ');
};

export default function LocationPicker({ initialValue = '', onSubmit }) {
  const [value, setValue] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (value.trim().length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(value)}`);
        setResults(await response.json());
      } catch { setResults([]); }
    }, 350);
    return () => clearTimeout(timer);
  }, [value]);

  const detect = () => {
    setError(''); setLoading(true);
    if (!navigator.geolocation) { setError('Location detection is not supported.'); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${coords.latitude}&lon=${coords.longitude}`);
        const item = await response.json();
        setValue(displayName(item) || item.display_name); setResults([]);
      } catch { setError('We could not identify that location. Search by city or ZIP instead.'); }
      setLoading(false);
    }, () => { setError('Location access was blocked. Search by city or ZIP instead.'); setLoading(false); }, { enableHighAccuracy: false, timeout: 10000 });
  };

  const choose = item => { setValue(displayName(item) || item.display_name); setResults([]); };
  return <div className="relative w-full">
    <button type="button" onClick={detect} disabled={loading} className="w-full mb-3 border border-[#5BC8C8] text-[#2c4a4a] rounded-full py-3 font-bold text-sm flex items-center justify-center gap-2">{loading ? <Loader2 size={17} className="animate-spin"/> : <LocateFixed size={17}/>}Use my current location</button>
    <input value={value} onChange={e=>setValue(e.target.value)} placeholder="Search city or ZIP code" className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#5BC8C8]" />
    {results.length > 0 && <div className="absolute z-20 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">{results.map(item=><button type="button" key={item.place_id} onClick={()=>choose(item)} className="w-full flex gap-2 p-3 text-left text-xs text-gray-600 border-b last:border-0 hover:bg-teal-50"><MapPin size={15} className="text-[#5BC8C8] shrink-0"/><span>{displayName(item) || item.display_name}</span></button>)}</div>}
    {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    <button type="button" disabled={!value.trim()} onClick={()=>onSubmit(value.trim())} className="w-full mt-3 bg-[#5BC8C8] disabled:opacity-40 text-white rounded-full py-3 font-bold">Continue</button>
  </div>;
}