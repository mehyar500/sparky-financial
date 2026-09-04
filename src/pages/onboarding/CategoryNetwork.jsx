import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'network.p', hint: 'network.hint', items: ['network.i1', 'network.i2', 'network.i3', 'network.i4'] },
];

export default function CategoryNetwork() {
  return <CategoryFlow emoji="😊" screens={SCREENS} next="/onboarding/category/handson" />;
}