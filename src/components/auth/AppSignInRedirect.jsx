import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function AppSignInRedirect() {
  const { pathname, search } = useLocation();
  return <Navigate to={`/app?returnTo=${encodeURIComponent(pathname + search)}`} replace />;
}