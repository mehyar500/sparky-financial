import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewPathSheet from '@/components/paths/NewPathSheet';
import { clearSession } from '@/lib/onboardingState';
import { useT } from '@/lib/i18n';

export default function NewIdeaButton({ paid }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useT();
  const start = () => { clearSession(); setOpen(false); navigate('/onboarding/name'); };
  return <>
    <button type="button" onClick={() => paid ? setOpen(true) : navigate('/my-paths')} aria-label={t('ideas.new')} title={t('ideas.new')} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-launch-ink px-3 text-sm font-bold text-launch-paper"><Plus size={18} aria-hidden="true" />{t('ideas.new')}</button>
    <NewPathSheet open={open} onConfirm={start} onCancel={() => setOpen(false)} />
  </>;
}