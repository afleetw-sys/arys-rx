'use client';

import { useCallback, useState } from 'react';

export interface SendReminderButtonProps {
  subscriberId: string;
  displayName: string;
}

export default function SendReminderButtonInner({ subscriberId, displayName }: SendReminderButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const onClick = useCallback(() => {
    setStatus('sent');
    window.setTimeout(() => setStatus('idle'), 2200);
    void subscriberId;
  }, [subscriberId]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === 'sent'}
      className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-default disabled:opacity-80"
      aria-label={`Send adherence reminder to ${displayName}`}
    >
      {status === 'sent' ? 'Reminder sent' : 'Send reminder'}
    </button>
  );
}
