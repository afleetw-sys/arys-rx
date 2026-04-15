import type { AdherenceStatus } from '@arys-rx/types';

interface Props {
  status: AdherenceStatus;
}

/** Taken / missed / pending dose status chip (shared PBM + HR detail tables). */
export function AdherenceDoseStatus({ status }: Props) {
  const styles =
    status === 'taken'
      ? { wrap: 'bg-success-50 text-success-700', dot: 'bg-success-500' }
      : status === 'pending'
        ? { wrap: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-400' }
        : { wrap: 'bg-danger-50 text-danger-700', dot: 'bg-danger-500' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium sm:px-2.5 sm:py-0.5 ${styles.wrap}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}
