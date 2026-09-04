import React from 'react';
import MobileShell from '@/components/MobileShell';
import SparkyAvatar from '@/components/SparkyAvatar';
import TealButton from '@/components/TealButton';
import { useT } from '@/lib/i18n';

// Sparky + text + Continue button. `children` renders the text block.
export default function IntroScreen({ children, expression = 'happy', size = 150, onContinue, buttonKey = 'common.continue', footer }) {
  const { t } = useT();
  return <MobileShell>
    <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
    <div className="flex flex-col items-center px-8 flex-1 pt-6 pb-4">
      <div className="text-center mb-4">{children}</div>
      <div className="flex-1 flex items-center justify-center"><SparkyAvatar size={size} expression={expression} /></div>
      {footer}
    </div>
    <div className="px-6 pb-8"><TealButton onClick={onContinue}>{t(buttonKey)}</TealButton></div>
  </MobileShell>;
}