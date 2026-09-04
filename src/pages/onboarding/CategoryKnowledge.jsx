import React from 'react';
import CategoryFlow from '@/components/onboarding/CategoryFlow';

const SCREENS = [
  { prompt: 'knowledge.p', hint: 'common.pickAll', items: ['knowledge.i1', 'knowledge.i2', 'knowledge.i3'] },
  { prompt: 'knowledge.p', hint: 'common.pickAll', items: ['knowledge.i4', 'knowledge.i5', 'knowledge.i6'] },
  { prompt: 'knowledge.p', hint: 'common.pickAll', items: ['knowledge.i7', 'knowledge.i8', 'knowledge.i9'] },
];

export default function CategoryKnowledge() {
  return <CategoryFlow emoji="🧠" title="cat.knowledge" intro="knowledge.intro" screens={SCREENS} next="/onboarding/category/creative" />;
}