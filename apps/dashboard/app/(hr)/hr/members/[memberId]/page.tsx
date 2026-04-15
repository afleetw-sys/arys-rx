import { AdherenceHistoryTable } from '@/components/AdherenceHistoryTable';
import { SendReminderButton } from '@/components/SendReminderButton';
import { SubscriberProfileHeader } from '@/components/SubscriberProfileHeader';
import { loadMemberDetail } from '@/lib/dashboard-load';
import { medicationProgramLine, safeAdherenceRate } from '@/lib/member-summary';
import { subscriberDisplayName } from '@/lib/subscriber-display-name';
import Link from 'next/link';

interface Props {
  params: Promise<{ memberId: string }>;
}

export default async function HrMemberDetailPage({ params }: Props) {
  const { memberId } = await params;
  const { records, member } = await loadMemberDetail(memberId, 'hr');

  if (!member) {
    return <div className="text-neutral-500">Member not found.</div>;
  }

  const completed = records.filter((r) => r.status !== 'pending');
  const displayName = subscriberDisplayName(member.id, member);

  return (
    <div className="space-y-8">
      <Link href="/hr" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Dashboard
      </Link>

      <SubscriberProfileHeader
        displayName={displayName}
        programSummaryLine={medicationProgramLine(member.summary)}
        adherenceRate={safeAdherenceRate(member.summary)}
        actions={
          <SendReminderButton subscriberId={member.id} displayName={displayName} />
        }
      />

      <AdherenceHistoryTable records={completed} title="Dose log" showDrugColumn={false} />
    </div>
  );
}
