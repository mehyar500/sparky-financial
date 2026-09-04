import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import confetti from 'canvas-confetti';
import { useT } from '@/lib/i18n';

export default function Confetti() {
  const navigate = useNavigate();
  const { t } = useT();

  useEffect(() => {
    const duration = 1800;
    const end = Date.now() + duration;
    const colors = ['#5BC8C8', '#FFD700', '#FF6B9D', '#4ab5b5', '#ffffff'];

    confetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.5 }, colors });
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const timer = setTimeout(() => navigate('/great-choice'), 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileShell>
      <div className="flex-1 flex flex-col items-center justify-center bg-[#2c4a4a] min-h-[680px]">
        <div className="text-8xl animate-bounce">🎉</div>
        <p className="text-white font-bold text-2xl mt-6 text-center whitespace-pre-line">{t('confetti.text')}</p>
        <div className="mt-4 flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#5BC8C8] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </MobileShell>
  );
}