import type { AdherenceSummary, User } from '@arys-rx/types';
import { getAdherenceHistory } from '@/lib/api';

export type MemberWithSummary = User & { summary: AdherenceSummary };

export async function getProgramMetrics(members: MemberWithSummary[]): Promise<{
  enrolledCount: number;
  averageAdherence: number;
  videoVerificationRate: number;
}> {
  const histories = await Promise.all(members.map((m) => getAdherenceHistory(m.id)));
  const allRecords = histories.flat();
  const taken = allRecords.filter((r) => r.status === 'taken');
  const withVideo = taken.filter((r) => r.videoId != null);
  const videoVerificationRate = taken.length
    ? Math.round((withVideo.length / taken.length) * 100)
    : 0;

  const averageAdherence =
    members.length === 0
      ? 0
      : Math.round(
          members.reduce((s, m) => {
            const r = m.summary.adherenceRate;
            return s + (typeof r === 'number' && Number.isFinite(r) ? r : 0);
          }, 0) / members.length,
        );

  return {
    enrolledCount: members.length,
    averageAdherence,
    videoVerificationRate,
  };
}
