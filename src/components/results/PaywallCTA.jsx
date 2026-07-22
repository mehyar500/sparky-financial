import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PaywallCTA({ profileId }) {
  const [loading, setLoading] = useState(false);
  const checkout = async () => {
    if (window.self !== window.top) { alert('Checkout works from the published app. Open FirstDollar in a new tab to continue.'); return; }
    setLoading(true);
    const r = await base44.functions.invoke('createCheckout', { origin: window.location.origin, profileId });
    window.location.href = r.data.url;
  };
  return (
    <div className="bg-white/10 border border-white/20 rounded-3xl p-5 mt-5 text-center">
      <p className="text-white font-black">Ready to start earning?</p>
      <p className="text-white/70 text-sm mt-2">Unlock my personalized action plan and ongoing Sparky coaching — $7.99/month.</p>
      <button onClick={checkout} className="w-full bg-[#5BC8C8] text-white rounded-full py-3.5 font-bold mt-4 flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin"/> : 'Unlock My Action Plan'}
      </button>
    </div>
  );
}