import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileShell from '@/components/MobileShell';
import ChangeOptionDialog from '@/components/ChangeOptionDialog';
import { useAuth } from '@/lib/AuthContext';
import { getSession } from '@/lib/onboardingState';
import { getActivePath, touchPath } from '@/lib/pathData';

export default function Settings() {
  const { user, logout } = useAuth(), s = getSession() || {};
  const navigate = useNavigate();
  const [changeOpen, setChangeOpen] = useState(false);
  const [changing, setChanging] = useState(false);

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
        <span className="inline-block bg-teal-50 text-[#287c7c] text-xs font-bold px-3 py-1 rounded-full mt-3">{s.is_paid ? 'FirstDollar Plus' : 'Free plan'}</span>
      </div>
      <div className="bg-white rounded-2xl p-5 mt-4">
        <p className="font-bold text-[#183b3b] text-sm">My Plan</p>
        <button onClick={() => setChangeOpen(true)} className="w-full bg-[#5BC8C8] text-[#183b3b] rounded-full py-3 font-bold text-sm mt-3">Change my income option</button>
      </div>
      <div className="bg-white rounded-2xl mt-4 divide-y">
        <Link className="block p-4 text-sm" to="/privacy">Privacy Policy</Link>
        <Link className="block p-4 text-sm" to="/terms">Terms of Service</Link>
        <button onClick={() => logout()} className="block p-4 text-sm text-red-500 w-full text-left">Sign out</button>
      </div>
      <p className="text-xs text-gray-400 mt-6">To request account and data deletion, contact Base44 support through the official support channel.</p>
    </div>
    <ChangeOptionDialog open={changeOpen} loading={changing} onConfirm={confirmChange} onCancel={() => setChangeOpen(false)}/>
  </MobileShell>;
}