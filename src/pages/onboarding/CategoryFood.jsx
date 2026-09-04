import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'food.p', hint: 'common.pickAll', items: ['food.i1', 'food.i2', 'food.i3'] },
  { prompt: 'food.p', hint: 'common.pickAll', items: ['food.i4', 'food.i5', 'food.i6'] },
];

export default function CategoryFood() {
  return <CategoryFlow emoji="🍳" title="cat.food" intro="food.intro" screens={SCREENS} next="/onboarding/category/knowledge" />;
}