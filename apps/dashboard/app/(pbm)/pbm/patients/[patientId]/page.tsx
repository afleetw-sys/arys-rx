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
  const displayName = subscriberDisplayName(patient.id, patient);

  return (
    <div className="space-y-8">
      <Link href="/pbm" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Patients
      </Link>

      <SubscriberProfileHeader
        displayName={displayName}
        companyName={patient.companyName}
        programSummaryLine={medicationProgramLine(patient.summary)}
        adherenceRate={safeAdherenceRate(patient.summary)}
        secondaryId={patient.id}
      />

      <AdherenceHistoryTable
        records={completed}
        title="Adherence history"
        showDrugColumn
      />
    </div>
  );
}
