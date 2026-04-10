import type { VideoMetadata, VideoUploadUrl } from '@arys-rx/types';
import { MOCK_VIDEOS } from './mock-data';

/** Request a presigned URL to upload a video directly to storage. */
export async function getUploadUrl(_input: {
  adherenceRecordId: string;
  contentType: string;
  fileSizeBytes: number;
}): Promise<VideoUploadUrl> {
  await delay();
  return {
    uploadUrl: 'https://mock-storage.example.com/upload',
    videoId: `vid-${Date.now()}`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}

/** Confirm that a video upload completed successfully. */
export async function confirmUpload(videoId: string): Promise<VideoMetadata> {
  await delay();
  return {
    id: videoId,
    subscriberId: 'user-sub-001',
    adherenceRecordId: 'rec-pending',
    storageKey: `videos/user-sub-001/${videoId}.mp4`,
    durationSeconds: 12,
    status: 'processing',
    uploadedAt: new Date().toISOString(),
  };
}

/** Get video metadata for a specific adherence record (PBM view). */
export async function getVideoForRecord(adherenceRecordId: string): Promise<VideoMetadata | null> {
  await delay();
  return MOCK_VIDEOS.find((v) => v.adherenceRecordId === adherenceRecordId) ?? null;
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
