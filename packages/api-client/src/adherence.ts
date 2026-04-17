import type { AdherenceRecord, AdherenceSummary } from '@arys-rx/types';
import {
  MOCK_ADHERENCE_RECORDS,
  MOCK_ADHERENCE_SUMMARY,
  MOCK_MEMBER_SUMMARIES_HR,
  MOCK_MEMBER_SUMMARIES_PBM,
} from './mock-data';

export async function getAdherenceHistory(subscriberId: string): Promise<AdherenceRecord[]> {
  await delay();
  const directRecords = MOCK_ADHERENCE_RECORDS.filter((r) => r.subscriberId === subscriberId);
  if (directRecords.length > 0) {
    return directRecords;
  }

  const memberSummary = MOCK_MEMBER_SUMMARIES_PBM.find((member) => member.id === subscriberId)?.summary;
  if (!memberSummary) {
    return [];
  }

  return buildSyntheticHistory(subscriberId, memberSummary);
}

export async function getAdherenceSummary(subscriberId: string): Promise<AdherenceSummary> {
  await delay();
  void subscriberId;
  return MOCK_ADHERENCE_SUMMARY;
}

export async function getAllMemberSummaries(
  portal: 'hr' | 'pbm',
): Promise<(import('@arys-rx/types').User & { summary: AdherenceSummary })[]> {
  await delay();
  return portal === 'hr' ? MOCK_MEMBER_SUMMARIES_HR : MOCK_MEMBER_SUMMARIES_PBM;
}

export async function submitAdherenceRecord(input: {
  drugId: string;
  scheduledAt: string;
  takenAt: string;
  videoId?: string;
  notes?: string;
}): Promise<AdherenceRecord> {
  await delay();
  const record: AdherenceRecord = {
    id: `rec-${Date.now()}`,
    subscriberId: 'user-sub-001',
    drugId: input.drugId,
    drugName: 'Humira',
    scheduledAt: input.scheduledAt,
    takenAt: input.takenAt,
    status: 'taken',
    videoId: input.videoId ?? null,
    notes: input.notes ?? null,
  };
  MOCK_ADHERENCE_RECORDS.unshift(record);
  return record;
}

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSyntheticHistory(subscriberId: string, summary: AdherenceSummary): AdherenceRecord[] {
  const maxRows = 14;
  const minRows = 4;
  const totalWindow = Math.max(minRows, Math.min(maxRows, summary.totalDoses || minRows));
  const takenRatio = summary.totalDoses > 0 ? summary.takenDoses / summary.totalDoses : 0;
  const takenCount = Math.max(0, Math.min(totalWindow, Math.round(totalWindow * takenRatio)));
  const missedCount = totalWindow - takenCount;
  const base = summary.lastTakenAt ? new Date(summary.lastTakenAt) : new Date();
  const records: AdherenceRecord[] = [];

  for (let i = 0; i < totalWindow; i += 1) {
    const status: AdherenceRecord['status'] = i < missedCount ? 'missed' : 'taken';
    const scheduledAt = new Date(base);
    scheduledAt.setDate(base.getDate() - i * 7);

    const takenAt =
      status === 'taken' ? new Date(scheduledAt.getTime() + (12 + (i % 9)) * 60 * 1000).toISOString() : null;
    const hasVideo = status === 'taken' && i % 4 !== 0;

    records.push({
      id: `rec-${subscriberId}-${i + 1}`,
      subscriberId,
      drugId: summary.drugId,
      drugName: summary.drugName,
      scheduledAt: scheduledAt.toISOString(),
      takenAt,
      status,
      videoId: hasVideo ? `vid-${subscriberId}-${i + 1}` : null,
      notes: status === 'missed' ? 'No check-in submitted' : null,
    });
  }

  return records;
}
