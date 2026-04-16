import type { AdherenceRecord, AdherenceSummary } from '@arys-rx/types';
import {
  MOCK_ADHERENCE_RECORDS,
  MOCK_ADHERENCE_SUMMARY,
  MOCK_MEMBER_SUMMARIES_HR,
  MOCK_MEMBER_SUMMARIES_PBM,
} from './mock-data';

export async function getAdherenceHistory(subscriberId: string): Promise<AdherenceRecord[]> {
  await delay();
  return MOCK_ADHERENCE_RECORDS.filter((r) => r.subscriberId === subscriberId);
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
