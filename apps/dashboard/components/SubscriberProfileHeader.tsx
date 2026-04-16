import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';

interface Props {
  displayName: string;
  companyName?: string | null;
  programSummaryLine: string;
  adherenceRate: number;
  secondaryId?: string | null;
  actions?: React.ReactNode;
}

export function SubscriberProfileHeader({
  displayName,
  companyName,
  programSummaryLine,
  adherenceRate,
  secondaryId,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{displayName}</h1>
        {companyName ? <p className="text-sm font-medium text-neutral-600">{companyName}</p> : null}
        <p className="text-sm text-neutral-500">{programSummaryLine}</p>
        {secondaryId ? <p className="mt-0.5 text-xs text-neutral-400">{secondaryId}</p> : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        {actions}
        <AdherenceRateBadge rate={adherenceRate} size="lg" />
      </div>
    </div>
  );
}
