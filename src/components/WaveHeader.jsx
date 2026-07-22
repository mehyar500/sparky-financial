import React from 'react';

export default function WaveHeader({ height = 80, children }) {
  return (
    <div
      className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%] flex-shrink-0 flex flex-col items-center justify-end pb-5 px-6"
      style={{ minHeight: height }}
    >
      {children}
    </div>
  );
}