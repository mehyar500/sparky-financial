import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { safeReturnTo } from '@/lib/authReturnTo';
import { getActivePath, getMyProfile, getAllPaths } from '@/lib/pathData';

export default function useResumeApp() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const resume = async () => {
    setLoading(true); setError('');
    try {
      const target = safeReturnTo();
      if (!isAuthenticated) {
        const returnPath = target === '/' ? '/app' : `/app?returnTo=${encodeURIComponent(target)}`;
        await base44.auth.loginWithProvider('google', window.location.origin + returnPath);
        return;
      }
      const targetUrl = new URL(target, window.location.origin);
      const requestedId = targetUrl.searchParams.get('pathId');
      const [path, profile] = await Promise.all([getActivePath(requestedId), getMyProfile()]);
      if (path || (requestedId && targetUrl.pathname === '/coach')) {
        navigate(target !== '/' && !['/app', '/login', '/register'].includes(targetUrl.pathname) ? target : '/dashboard', { replace: true });
      } else {
        const paths = await getAllPaths();
        navigate(paths.length ? '/my-paths' : profile?.onboarding_complete ? '/results' : '/onboarding/name', { replace: true });
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (isAuthenticated) resume(); }, [isAuthenticated]);
  return { start: resume, loading: loading || (isAuthenticated && !error), error };
}