import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'online.p', hint: 'online.hint', items: ['online.i1', 'online.i2', 'online.i3'] },
  { prompt: 'online.p', hint: 'online.hint', items: ['online.i4', 'online.i5', 'online.i6'] },
  { prompt: 'online.aiPrompt', hint: 'online.aiHint', items: ['online.ai1', 'online.ai2', 'online.ai3'] },
  { prompt: 'online.aiPrompt', hint: 'online.aiHint', items: ['online.ai4', 'online.ai5', 'online.ai6'] },
];

export default function CategoryOnline() {
  return <CategoryFlow emoji="💻" title="cat.online" intro="online.intro" screens={SCREENS} next="/onboarding/extra-skills" />;
}