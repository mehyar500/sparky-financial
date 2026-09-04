import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'creative.p1', hint: 'common.pickAll', items: ['creative.i1', 'creative.i2', 'creative.i3'] },
  { prompt: 'creative.p2', hint: 'common.pickAll', items: ['creative.i4', 'creative.i5', 'creative.i6'] },
  { prompt: 'creative.p3', hint: 'creative.hint3', items: ['creative.i7', 'creative.i8'] },
];

export default function CategoryCreative() {
  return <CategoryFlow emoji="🎨" title="cat.creative" intro="creative.intro" screens={SCREENS} next="/onboarding/category/network" />;
}