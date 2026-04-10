import { getAdherenceHistory, getAllMemberSummaries } from '@/lib/api';
import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';
import Link from 'next/link';

interface Props {
  params: Promise<{ memberId: string }>;
}

export default async function HrMemberDetailPage({ params }: Props) {
  const { memberId } = await params;
  const [records, members] = await Promise.all([
    getAdherenceHistory(memberId),
    getAllMemberSummaries(),
  ]);
  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return <div className="text-neutral-500">Member not found.</div>;
  }

  const completed = records.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/hr" className="text-brand-600 hover:underline text-sm">
          ← Members
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-neutral-500 text-sm">{member.email}</p>
        </div>
        <AdherenceRateBadge rate={member.summary.adherenceRate} size="lg" />
      </div>

      {/* Adherence history — HR view shows status only, no video */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
          <span className="font-medium text-neutral-700 text-sm">Adherence history</span>
          <span className="text-neutral-400 text-xs ml-2">({completed.length} doses)</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Scheduled</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Drug</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Taken at</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-700">
                  {new Date(r.scheduledAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-neutral-700">{r.drugName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'taken'
                        ? 'bg-success-50 text-success-700'
                        : 'bg-danger-50 text-danger-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        r.status === 'taken' ? 'bg-success-500' : 'bg-danger-500'
                      }`}
                    />
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {r.takenAt ? new Date(r.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
