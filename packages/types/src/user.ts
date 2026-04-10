export type Role = 'subscriber' | 'hr' | 'pbm';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface SubscriberProfile {
  userId: string;
  memberId: string;
  employerId: string;
  drugIds: string[];
  enrolledAt: string;
}
