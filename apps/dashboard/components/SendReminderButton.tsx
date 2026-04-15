'use client';

import dynamic from 'next/dynamic';
import type { SendReminderButtonProps } from './SendReminderButtonInner';

export const SendReminderButton = dynamic<SendReminderButtonProps>(
  () => import('./SendReminderButtonInner'),
  {
    ssr: false,
    loading: () => (
      <span
        className="inline-block min-h-[34px] min-w-[6.75rem] rounded-lg border border-transparent"
        aria-hidden
      />
    ),
  },
);
