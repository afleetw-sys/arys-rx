import { AdherenceHistoryTable } from '@/components/AdherenceHistoryTable';
import { SubscriberProfileHeader } from '@/components/SubscriberProfileHeader';
import { loadMemberDetail } from '@/lib/dashboard-load';
import { medicationProgramLine, safeAdherenceRate } from '@/lib/member-summary';
import { subscriberDisplayName } from '@/lib/subscriber-display-name';
import Link from 'next/link';

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function PbmPatientDetailPage({ params }: Props) {
  const { patientId } = await params;
  const { records, member: patient } = await loadMemberDetail(patientId, 'pbm');

  if (!patient) {
    return <div className="text-neutral-500">Patient not found.</div>;
  }

  const completed = records.filter((r) => r.status !== 'pending');
  const takenCount = records.filter((r) => r.status === 'taken').length;
  const missedCount = records.filter((r) => r.status === 'missed').length;
  const pendingCount = records.filter((r) => r.status === 'pending').length;
  const verifiedCount = records.filter((r) => r.status === 'taken' && r.videoId).length;
  const displayName = subscriberDisplayName(patient.id, patient);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-5 ring-1 ring-neutral-200/70 sm:p-6">
        <Link
          href="/pbm"
          className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
        >
          ← Back to patients
        </Link>

        <div className="mt-4">
          <SubscriberProfileHeader
            displayName={displayName}
            companyName={patient.companyName}
            programSummaryLine={medicationProgramLine(patient.summary)}
            adherenceRate={safeAdherenceRate(patient.summary)}
            secondaryId={patient.id}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-200/60">
            <p className="text-xs font-medium text-neutral-500">Taken doses</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 tabular-nums">{takenCount}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-200/60">
            <p className="text-xs font-medium text-neutral-500">Missed doses</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 tabular-nums">{missedCount}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-200/60">
            <p className="text-xs font-medium text-neutral-500">Pending doses</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 tabular-nums">{pendingCount}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-neutral-200/60">
            <p className="text-xs font-medium text-neutral-500">Video verified</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 tabular-nums">{verifiedCount}</p>
          </div>
        </div>
      </section>

      <AdherenceHistoryTable
        records={completed}
        title="Adherence history"
        showDrugColumn
      />
    </div>
  );
}
