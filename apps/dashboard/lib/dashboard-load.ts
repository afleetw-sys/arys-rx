import { getAdherenceHistory, getAllMemberSummaries } from '@/lib/api';
import { getProgramMetrics, type MemberWithSummary } from '@/lib/program-metrics';

export async function loadDashboardRoster(portal: 'hr' | 'pbm'): Promise<{
  members: MemberWithSummary[];
  metrics: Awaited<ReturnType<typeof getProgramMetrics>>;
}> {
  const members = await getAllMemberSummaries(portal);
  const metrics = await getProgramMetrics(members);
  return { members, metrics };
}

export async function loadMemberDetail(memberId: string, portal: 'hr' | 'pbm') {
  const [records, members] = await Promise.all([
    getAdherenceHistory(memberId),
    getAllMemberSummaries(portal),
  ]);
  const member = members.find((m) => m.id === memberId);
  return { records, member };
}
