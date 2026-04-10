import type { AdherenceRecord, AdherenceSummary, Drug, User, VideoMetadata } from '@arys-rx/types';

export const MOCK_DRUGS: Drug[] = [
  {
    id: 'drug-001',
    name: 'Humira',
    genericName: 'adalimumab',
    manufacturer: 'AbbVie',
    requiresVideoAdherence: true,
    dosageInstructions: 'Inject subcutaneously every other week',
  },
  {
    id: 'drug-002',
    name: 'Enbrel',
    genericName: 'etanercept',
    manufacturer: 'Amgen',
    requiresVideoAdherence: true,
    dosageInstructions: 'Inject subcutaneously once weekly',
  },
];

export const MOCK_SUBSCRIBER: User = {
  id: 'user-sub-001',
  email: 'jane.doe@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'subscriber',
  createdAt: '2024-01-15T00:00:00Z',
};

export const MOCK_HR_USER: User = {
  id: 'user-hr-001',
  email: 'hr@acme.com',
  firstName: 'Chris',
  lastName: 'Taylor',
  role: 'hr',
  createdAt: '2024-01-01T00:00:00Z',
};

export const MOCK_PBM_USER: User = {
  id: 'user-pbm-001',
  email: 'analyst@caremark.com',
  firstName: 'Alex',
  lastName: 'Rivera',
  role: 'pbm',
  createdAt: '2024-01-01T00:00:00Z',
};

export const MOCK_ADHERENCE_RECORDS: AdherenceRecord[] = [
  {
    id: 'rec-001',
    subscriberId: 'user-sub-001',
    drugId: 'drug-001',
    drugName: 'Humira',
    scheduledAt: '2024-04-08T08:00:00Z',
    takenAt: '2024-04-08T08:12:00Z',
    status: 'taken',
    videoId: 'vid-001',
    notes: null,
  },
  {
    id: 'rec-002',
    subscriberId: 'user-sub-001',
    drugId: 'drug-001',
    drugName: 'Humira',
    scheduledAt: '2024-03-25T08:00:00Z',
    takenAt: '2024-03-25T09:01:00Z',
    status: 'taken',
    videoId: 'vid-002',
    notes: null,
  },
  {
    id: 'rec-003',
    subscriberId: 'user-sub-001',
    drugId: 'drug-001',
    drugName: 'Humira',
    scheduledAt: '2024-03-11T08:00:00Z',
    takenAt: null,
    status: 'missed',
    videoId: null,
    notes: 'Reported travel',
  },
  {
    id: 'rec-004',
    subscriberId: 'user-sub-001',
    drugId: 'drug-001',
    drugName: 'Humira',
    scheduledAt: '2024-04-22T08:00:00Z',
    takenAt: null,
    status: 'pending',
    videoId: null,
    notes: null,
  },
];

export const MOCK_ADHERENCE_SUMMARY: AdherenceSummary = {
  subscriberId: 'user-sub-001',
  drugId: 'drug-001',
  drugName: 'Humira',
  totalDoses: 8,
  takenDoses: 7,
  adherenceRate: 87.5,
  lastTakenAt: '2024-04-08T08:12:00Z',
};

// Multiple members for the HR / PBM dashboard views
export const MOCK_MEMBER_SUMMARIES: (User & { summary: AdherenceSummary })[] = [
  {
    id: 'user-sub-001',
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'subscriber',
    createdAt: '2024-01-15T00:00:00Z',
    summary: MOCK_ADHERENCE_SUMMARY,
  },
  {
    id: 'user-sub-002',
    email: 'mark.smith@example.com',
    firstName: 'Mark',
    lastName: 'Smith',
    role: 'subscriber',
    createdAt: '2024-02-01T00:00:00Z',
    summary: {
      subscriberId: 'user-sub-002',
      drugId: 'drug-002',
      drugName: 'Enbrel',
      totalDoses: 12,
      takenDoses: 12,
      adherenceRate: 100,
      lastTakenAt: '2024-04-07T10:00:00Z',
    },
  },
  {
    id: 'user-sub-003',
    email: 'priya.patel@example.com',
    firstName: 'Priya',
    lastName: 'Patel',
    role: 'subscriber',
    createdAt: '2024-03-01T00:00:00Z',
    summary: {
      subscriberId: 'user-sub-003',
      drugId: 'drug-001',
      drugName: 'Humira',
      totalDoses: 6,
      takenDoses: 3,
      adherenceRate: 50,
      lastTakenAt: '2024-03-18T11:30:00Z',
    },
  },
];

export const MOCK_VIDEOS: VideoMetadata[] = [
  {
    id: 'vid-001',
    subscriberId: 'user-sub-001',
    adherenceRecordId: 'rec-001',
    storageKey: 'videos/user-sub-001/rec-001.mp4',
    durationSeconds: 14,
    status: 'ready',
    uploadedAt: '2024-04-08T08:13:00Z',
    playbackUrl: 'https://example.com/mock-video-playback',
  },
  {
    id: 'vid-002',
    subscriberId: 'user-sub-001',
    adherenceRecordId: 'rec-002',
    storageKey: 'videos/user-sub-001/rec-002.mp4',
    durationSeconds: 18,
    status: 'ready',
    uploadedAt: '2024-03-25T09:02:00Z',
    playbackUrl: 'https://example.com/mock-video-playback',
  },
];
