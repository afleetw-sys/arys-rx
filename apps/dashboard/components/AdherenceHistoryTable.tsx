import type { AdherenceRecord } from '@arys-rx/types';
import { AdherenceDoseStatus } from '@/components/AdherenceDoseStatus';
import { formatDashboardDate, formatDashboardTime } from '@/lib/format-dashboard-date';
import {
  detailTableClass,
  tableCardClass,
  tableScrollClass,
  tdClass,
  thClass,
  thRowClass,
  trClass,
} from '@/lib/dashboard-ui';

interface Props {
  records: AdherenceRecord[];
  title: string;
  /** PBM shows medication column; HR omits it. */
  showDrugColumn: boolean;
}

export function AdherenceHistoryTable({ records, title, showDrugColumn }: Props) {
  const count = records.length;
  const suffix = showDrugColumn ? 'doses' : 'recorded';

  return (
    <div className={tableCardClass}>
      <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 sm:px-5 sm:py-3.5">
        <span className="text-sm font-semibold text-neutral-800">{title}</span>
        <span className="ml-2 text-xs text-neutral-400">
          ({count} {suffix})
        </span>
      </div>
      <div className={tableScrollClass}>
        <table className={detailTableClass}>
          <thead>
            <tr className={thRowClass}>
              <th className={thClass}>Scheduled</th>
              {showDrugColumn ? <th className={thClass}>Drug</th> : null}
              <th className={thClass}>Status</th>
              <th className={thClass}>{showDrugColumn ? 'Taken at' : 'Logged at'}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className={trClass}>
                <td className={`${tdClass} text-neutral-700`}>{formatDashboardDate(r.scheduledAt)}</td>
                {showDrugColumn ? (
                  <td className={`${tdClass} text-neutral-700`}>{r.drugName}</td>
                ) : null}
                <td className={tdClass}>
                  <AdherenceDoseStatus status={r.status} />
                </td>
                <td className={`${tdClass} text-neutral-500`}>{formatDashboardTime(r.takenAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
