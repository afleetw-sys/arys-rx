import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';
import { DashboardTableCard } from '@/components/DashboardTableCard';
import { ProgramOverview } from '@/components/ProgramOverview';
import { loadDashboardRoster } from '@/lib/dashboard-load';
import { pageStackClass, rosterTableClass, sectionIntroClass, tdClass, thClass, thRowClass, trClass } from '@/lib/dashboard-ui';
import { formatDashboardDateNumeric } from '@/lib/format-dashboard-date';
import { formatMedicationCount, safeAdherenceRate } from '@/lib/member-summary';
import { sortMembersForPortal } from '@/lib/roster-sort';
import { subscriberDisplayName } from '@/lib/subscriber-display-name';
import Link from 'next/link';

export default async function PbmPatientsPage() {
  const { members, metrics } = await loadDashboardRoster('pbm');
  const sorted = sortMembersForPortal('pbm', members);

  return (
    <div className={pageStackClass}>
      <ProgramOverview metrics={metrics} />

      <section className={sectionIntroClass}>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Patients</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Book of business across employer groups — adherence, medications, and recent activity.
          </p>
        </div>

        <DashboardTableCard>
          <table className={rosterTableClass}>
            <thead>
              <tr className={thRowClass}>
                <th className={thClass}>Company</th>
                <th className={thClass}>Patient</th>
                <th className={thClass}>Medications</th>
                <th className={thClass}>Doses</th>
                <th className={thClass}>Adherence</th>
                <th className={thClass}>Last dose</th>
                <th className={thClass} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const displayName = subscriberDisplayName(p.id, p);
                return (
                  <tr key={p.id} className={trClass}>
                    <td className={`${tdClass} text-neutral-700`}>{p.companyName ?? '—'}</td>
                    <td className={tdClass}>
                      <div className="font-medium text-neutral-800">{displayName}</div>
                      <div className="text-xs text-neutral-400">{p.id}</div>
                    </td>
                    <td className={`${tdClass} tabular-nums text-neutral-700`}>
                      {formatMedicationCount(p.summary)}
                    </td>
                    <td className={`${tdClass} tabular-nums text-neutral-700`}>
                      {p.summary.takenDoses}/{p.summary.totalDoses}
                    </td>
                    <td className={tdClass}>
                      <AdherenceRateBadge rate={safeAdherenceRate(p.summary)} />
                    </td>
                    <td className={`${tdClass} text-neutral-500`}>
                      {formatDashboardDateNumeric(p.summary.lastTakenAt)}
                    </td>
                    <td className={tdClass}>
                      <Link
                        href={`/pbm/patients/${p.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DashboardTableCard>
      </section>
    </div>
  );
}
