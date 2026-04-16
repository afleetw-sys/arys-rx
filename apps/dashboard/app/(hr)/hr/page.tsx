import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';
import { DashboardTableCard } from '@/components/DashboardTableCard';
import { MemberOnTrackBadge } from '@/components/MemberOnTrackBadge';
import { ProgramOverview } from '@/components/ProgramOverview';
import { SendReminderButton } from '@/components/SendReminderButton';
import { loadDashboardRoster } from '@/lib/dashboard-load';
import { pageStackClass, rosterTableClass, sectionIntroClass, tdClass, thClass, thRowClass, trClass } from '@/lib/dashboard-ui';
import { formatMedicationCount, safeAdherenceRate } from '@/lib/member-summary';
import { sortMembersForPortal } from '@/lib/roster-sort';
import { subscriberDisplayName } from '@/lib/subscriber-display-name';

export default async function HrMembersPage() {
  const { members, metrics } = await loadDashboardRoster('hr');
  const sorted = sortMembersForPortal('hr', members);

  return (
    <div className={pageStackClass}>
      <ProgramOverview metrics={metrics} />

      <section className={sectionIntroClass}>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Member adherence</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Plan-level adherence and engagement for your covered population.
          </p>
        </div>

        <DashboardTableCard>
          <table className={rosterTableClass}>
            <thead>
              <tr className={thRowClass}>
                <th className={thClass}>Member</th>
                <th className={thClass}>Medications</th>
                <th className={thClass}>Adherence</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Reminder</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => {
                const rate = safeAdherenceRate(m.summary);
                const displayName = subscriberDisplayName(m.id, m);
                return (
                  <tr key={m.id} className={trClass}>
                    <td className={`${tdClass} font-medium text-neutral-800`}>{displayName}</td>
                    <td className={`${tdClass} tabular-nums text-neutral-700`}>
                      {formatMedicationCount(m.summary)}
                    </td>
                    <td className={tdClass}>
                      <AdherenceRateBadge rate={rate} />
                    </td>
                    <td className={tdClass}>
                      <MemberOnTrackBadge onTrack={rate >= 80} />
                    </td>
                    <td className={tdClass}>
                      <SendReminderButton subscriberId={m.id} displayName={displayName} />
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
