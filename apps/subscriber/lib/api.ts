import {
  getAdherenceHistory,
  submitAdherenceRecord as submitRecord,
} from '@arys-rx/api-client';

const MOCK_SUBSCRIBER_ID = 'user-sub-001';

export function getAllAdherenceHistory() {
  return getAdherenceHistory(MOCK_SUBSCRIBER_ID);
}

export function submitAdherenceRecord(input: {
  drugId: string;
  scheduledAt: string;
  takenAt: string;
  videoId?: string;
  notes?: string;
}) {
  return submitRecord(input);
}
