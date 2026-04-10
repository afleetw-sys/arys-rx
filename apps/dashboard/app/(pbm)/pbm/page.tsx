import { getAllMemberSummaries } from '@/lib/api';
import { AdherenceRateBadge } from '@/components/AdherenceRateBadge';
import Link from 'next/link';

export default async function PbmPatientsPage() {
  const patients = await getAllMemberSummaries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Patients</h1>
        <p className="text-neutral-500 text-sm mt-1">Full adherence data including video records</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Patient</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Drug</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Doses</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Adherence</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Last dose</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-800">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-neutral-400 text-xs">{p.id}</div>
                </td>
                <td className="px-4 py-3 text-neutral-700">{p.summary.drugName}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {p.summary.takenDoses}/{p.summary.totalDoses}
                </td>
                <td className="px-4 py-3">
                  <AdherenceRateBadge rate={p.summary.adherenceRate} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {p.summary.lastTakenAt
                    ? new Date(p.summary.lastTakenAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/pbm/patients/${p.id}`}
                    className="text-brand-600 hover:underline text-xs font-medium"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
