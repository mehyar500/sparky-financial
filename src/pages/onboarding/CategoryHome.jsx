import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'home.p1', hint: 'common.pickAll', items: ['home.i1', 'home.i2', 'home.i3'] },
  { prompt: 'home.p2', hint: 'common.pickAll', items: ['home.i4', 'home.i5', 'home.i6'] },
  { prompt: 'home.p3', hint: 'common.pickAll', items: ['home.i7', 'home.i8', 'home.i9'] },
];

export default function CategoryHome() {
  return <CategoryFlow emoji="🏠" title="cat.home" intro="home.intro" screens={SCREENS} next="/onboarding/category/transition" />;
}