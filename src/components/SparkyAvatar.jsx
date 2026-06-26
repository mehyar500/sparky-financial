import React from 'react';

// Sparky SVG robot face - light teal/cyan kawaii style
export default function SparkyAvatar({ size = 120, expression = 'happy' }) {
  const expressions = {
    happy: { eyes: '●', mouth: '‿', color: '#5BC8C8' },
    excited: { eyes: '★', mouth: '◡', color: '#5BC8C8' },
    thinking: { eyes: '◑', mouth: '~', color: '#7dd4d4' },
    sad: { eyes: '◕', mouth: '︵', color: '#8ec9c9' },
    waving: { eyes: '●', mouth: '‿', color: '#5BC8C8' },
  };
  const expr = expressions[expression] || expressions.happy;

  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="60" y1="8" x2="60" y2="22" stroke={expr.color} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="60" cy="6" r="5" fill={expr.color} />
        {/* Head */}
        <rect x="18" y="22" width="84" height="70" rx="18" ry="18" fill={expr.color} />
        {/* Face screen */}
        <rect x="28" y="32" width="64" height="50" rx="12" ry="12" fill="#d8f5f5" />
        {/* Eyes */}
        <circle cx="44" cy="52" r="7" fill="#2a7a7a" />
        <circle cx="76" cy="52" r="7" fill="#2a7a7a" />
        <circle cx="46" cy="50" r="2.5" fill="white" />
        <circle cx="78" cy="50" r="2.5" fill="white" />
        {/* Mouth */}
        <path d="M 44 68 Q 60 80 76 68" stroke="#2a7a7a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Ears */}
        <rect x="10" y="38" width="10" height="20" rx="5" fill={expr.color} />
        <rect x="100" y="38" width="10" height="20" rx="5" fill={expr.color} />
        {/* Body */}
        <rect x="30" y="90" width="60" height="25" rx="12" fill={expr.color} />
        {/* Star on body */}
        <text x="60" y="108" textAnchor="middle" fontSize="14" fill="white">✦</text>
        {/* Sparkles */}
        <text x="10" y="35" fontSize="10" fill="#FFD700">✦</text>
        <text x="102" y="30" fontSize="8" fill="#FFD700">✦</text>
        <text x="6" y="55" fontSize="6" fill="#5BC8C8">✦</text>
      </svg>
    </div>
  );
}