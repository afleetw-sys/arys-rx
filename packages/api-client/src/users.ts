import type { User } from '@arys-rx/types';
import { MOCK_HR_USER, MOCK_PBM_USER, MOCK_SUBSCRIBER } from './mock-data';

const MOCK_USERS: Record<string, User> = {
  'user-sub-001': MOCK_SUBSCRIBER,
  'user-hr-001': MOCK_HR_USER,
  'user-pbm-001': MOCK_PBM_USER,
};

export async function getUser(userId: string): Promise<User | null> {
  await delay();
  return MOCK_USERS[userId] ?? null;
}

export async function getCurrentSubscriber(): Promise<User> {
  await delay();
  return MOCK_SUBSCRIBER;
}

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
