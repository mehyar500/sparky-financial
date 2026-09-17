import React from 'react';
import { useT } from '@/lib/i18n';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function NewPathSheet({ open, onConfirm, onCancel }) {
  const { t } = useT();
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={value => { if (!value) onCancel(); }}>
      <DialogContent className="w-[calc(100%_-_2rem)] max-w-md rounded-3xl bg-launch-night p-6 text-center text-launch-paper">
        <DialogTitle>{t('paths.sheet.title')}</DialogTitle>
        <DialogDescription className="text-launch-soft">{t('paths.sheet.desc')}</DialogDescription>
        <button onClick={onConfirm} className="min-h-11 w-full rounded-full bg-launch-mint py-3 font-bold text-launch-ink mt-3">{t('paths.sheet.yes')}</button>
        <button onClick={onCancel} className="min-h-11 w-full rounded-full border border-launch-soft/40 py-3 font-bold">{t('common.cancel')}</button>
      </DialogContent>
    </Dialog>
  );
}