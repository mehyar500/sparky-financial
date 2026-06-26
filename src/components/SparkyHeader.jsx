import React from 'react';

export default function SparkyHeader({ emoji = '🤖', height = 'h-28' }) {
  return (
    <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#4ab5b5] flex items-end justify-center pb-0 pt-6" style={{ minHeight: 110 }}>
      <div className={`${height} w-28 flex items-center justify-center text-7xl select-none`}>
        {emoji}
      </div>
    </div>
  );
}