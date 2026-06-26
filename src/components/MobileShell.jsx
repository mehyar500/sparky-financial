import React from 'react';

export default function MobileShell({ children, className = '' }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className={`w-full max-w-sm min-h-[680px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative ${className}`}>
        {children}
      </div>
    </div>
  );
}