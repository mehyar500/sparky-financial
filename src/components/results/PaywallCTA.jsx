import React, { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { startCheckout } from '@/lib/checkout';
import { useT } from '@/lib/i18n';

export default function PaywallCTA({ profileId }) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const go = async () => { setLoading(true); await startCheckout(profileId); setLoading(false); };
  return (
    <button onClick={go} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-4 font-bold flex items-center justify-center gap-2 text-sm">
      {loading ? <Loader2 className="animate-spin" size={18}/> : <><Lock size={15} className="flex-shrink-0"/> {t('paywall.cta')}</>}
    </button>
  );
}