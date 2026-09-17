import React from 'react';

export default function MobileShell({ children, className = '' }) {
  return (
    <div className="app-shell-viewport min-h-dvh bg-background sm:bg-muted flex items-start justify-center sm:p-4">
      <div className={`app-shell w-full sm:max-w-md bg-background sm:rounded-3xl sm:shadow-lg flex flex-col relative ${className}`}>
        {children}
      </div>
    </div>
  );
}