export type Role = 'subscriber' | 'hr' | 'pbm';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  /** Employer / plan sponsor (subscribers on a PBM roster). */
  companyName?: string;
}

export interface SubscriberProfile {
  userId: string;
  memberId: string;
  employerId: string;
  drugIds: string[];
  enrolledAt: string;
}
