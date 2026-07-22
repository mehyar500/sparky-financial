import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import ChangeOptionDialog from '@/components/ChangeOptionDialog';
import CancelPlanDialog from '@/components/CancelPlanDialog';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getSession } from '@/lib/onboardingState';
import { getActivePath, getMyProfile, touchPath } from '@/lib/pathData';

export default function Settings() {
  const { user, logout } = useAuth(), s = getSession() || {};
  const navigate = useNavigate();
  const [changeOpen, setChangeOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const [profile, setProfile] = useState(null);
  const [cancel, setCancel] = useState({ open: false, loading: false, done: false, until: null, error: null });

  React.useEffect(() => { getMyProfile().then(setProfile); }, []);

  const confirmCancel = async () => {
    setCancel(c => ({ ...c, loading: true, error: null }));
    try {
      const res = await base44.functions.invoke('cancelSubscription', {});
      setCancel({ open: false, loading: false, done: true, until: res.data.active_until, error: null });
    } catch {
      setCancel(c => ({ ...c, loading: false, error: 'Something went wrong. Please try again.' }));
    }
  };

  const confirmChange = async () => {
    setChanging(true);
    const path = await getActivePath();
    if (path) await touchPath(path.id, { status: 'paused', reason_paused: 'User wants different options' });
    navigate('/results');
  };

  return <MobileShell>
    <div className="min-h-[680px] bg-gray-50 p-5">
      <Link to="/dashboard" className="text-sm text-[#399d9d]">← Workspace</Link>
      <h1 className="text-3xl font-black text-[#183b3b] mt-6">Settings</h1>
      <div className="bg-white rounded-2xl p-5 mt-6">
        <p className="font-bold text-[#183b3b]">{user?.full_name || s.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="inline-block bg-teal-50 text-[#287c7c] text-xs font-bold px-3 py-1 rounded-full mt-3">{profile === null ? '...' : profile?.is_paid ? 'FirstDollar Plus ⭐' : 'Free plan'}</span>
      </div>
      <div className="bg-white rounded-2xl p-5 mt-4">
        <p className="font-bold text-[#183b3b] text-sm">My Plan</p>
        <button onClick={() => setChangeOpen(true)} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3 font-bold text-sm mt-3">Change my income option</button>
        {profile?.is_paid && !cancel.done && (
          <button onClick={() => setCancel(c => ({ ...c, open: true, error: null }))} className="w-full border border-red-200 text-red-500 rounded-full py-3 font-bold text-sm mt-2 hover:bg-red-50 transition-colors">Cancel my plan</button>
        )}
        {cancel.done && (
          <p className="text-xs text-gray-500 text-center mt-3 bg-gray-50 rounded-xl px-3 py-2.5">✅ Your plan is canceled. You keep Plus access{cancel.until ? ` until ${format(new Date(cancel.until), 'MMMM d, yyyy')}` : ' until the end of your billing period'}.</p>
        )}
      </div>
      <div className="bg-white rounded-2xl mt-4 divide-y">
        <Link className="block p-4 text-sm" to="/privacy">Privacy Policy</Link>
        <Link className="block p-4 text-sm" to="/terms">Terms of Service</Link>
        <button onClick={() => logout()} className="block p-4 text-sm text-red-500 w-full text-left">Sign out</button>
      </div>
      <p className="text-xs text-gray-400 mt-6">To request account and data deletion, contact Base44 support through the official support channel.</p>
    </div>
    <ChangeOptionDialog open={changeOpen} loading={changing} onConfirm={confirmChange} onCancel={() => setChangeOpen(false)}/>
    <CancelPlanDialog open={cancel.open} loading={cancel.loading} error={cancel.error} onConfirm={confirmCancel} onCancel={() => setCancel(c => ({ ...c, open: false }))}/>
  </MobileShell>;
}