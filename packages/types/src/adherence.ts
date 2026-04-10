export type AdherenceStatus = 'taken' | 'missed' | 'pending';

export interface AdherenceRecord {
  id: string;
  subscriberId: string;
  drugId: string;
  drugName: string;
  scheduledAt: string;
  takenAt: string | null;
  status: AdherenceStatus;
  videoId: string | null;
  notes: string | null;
}

export interface AdherenceSummary {
  subscriberId: string;
  drugId: string;
  drugName: string;
  totalDoses: number;
  takenDoses: number;
  adherenceRate: number;
  lastTakenAt: string | null;
}
