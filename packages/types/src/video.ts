export type VideoStatus = 'pending' | 'processing' | 'ready' | 'failed';

export interface VideoMetadata {
  id: string;
  subscriberId: string;
  adherenceRecordId: string;
  storageKey: string;
  durationSeconds: number;
  status: VideoStatus;
  uploadedAt: string;
  /** Presigned URL for playback — only present in PBM responses */
  playbackUrl?: string;
}

export interface VideoUploadUrl {
  uploadUrl: string;
  videoId: string;
  expiresAt: string;
}
