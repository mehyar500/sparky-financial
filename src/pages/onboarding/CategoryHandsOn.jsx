import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'handson.p', hint: 'handson.hint', items: ['handson.i1', 'handson.i2'] },
];

export default function CategoryHandsOn() {
  return <CategoryFlow emoji="🔧" title="cat.handson" intro="handson.intro" screens={SCREENS} next="/onboarding/category/online" />;
}