import { getAllMemberSummaries } from '@/lib/api';
import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';
import Link from 'next/link';

export default async function HrMembersPage() {
  const members = await getAllMemberSummaries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Members</h1>
        <p className="text-neutral-500 text-sm mt-1">Adherence overview for your plan members</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total members" value={members.length} />
        <StatCard
          label="On track (≥80%)"
          value={members.filter((m) => m.summary.adherenceRate >= 80).length}
          highlight
        />
        <StatCard
          label="At risk (<80%)"
          value={members.filter((m) => m.summary.adherenceRate < 80).length}
          danger
        />
      </div>

      {/* Member table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Member</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Drug</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Adherence</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Last dose</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link href={`/hr/members/${m.id}`} className="font-medium text-brand-600 hover:underline">
                    {m.firstName} {m.lastName}
                  </Link>
                  <div className="text-neutral-400 text-xs">{m.email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-700">{m.summary.drugName}</td>
                <td className="px-4 py-3">
                  <AdherenceRateBadge rate={m.summary.adherenceRate} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {m.summary.lastTakenAt
                    ? new Date(m.summary.lastTakenAt).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <div
        className={`text-3xl font-bold ${
          highlight ? 'text-success-600' : danger ? 'text-danger-600' : 'text-neutral-900'
        }`}
      >
        {value}
      </div>
      <div className="text-neutral-500 text-sm mt-1">{label}</div>
    </div>
  );
}
