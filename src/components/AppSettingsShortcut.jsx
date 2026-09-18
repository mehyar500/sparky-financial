import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const PUBLIC_PATHS = new Set([
  '/', '/app', '/home', '/waitlist', '/login', '/register',
  '/forgot-password', '/reset-password', '/privacy', '/terms'
]);

export default function AppSettingsShortcut() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthenticated || PUBLIC_PATHS.has(pathname)) return null;

  return (
    <Link
      to="/settings"
      aria-label="Open account settings"
      aria-current={pathname === '/settings' ? 'page' : undefined}
      className="fixed z-50 top-[calc(env(safe-area-inset-top,0px)+1rem)] right-4 sm:right-[calc((100vw-28rem)/2+1rem)] flex h-11 w-11 items-center justify-center rounded-full border border-teal-100 bg-white text-[#287c7c] shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287c7c]"
    >
      <Settings className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}