import type { Role } from '@arys-rx/types';
import { cookies } from 'next/headers';

/** Returns the current user's role from the session cookie. */
export async function getRole(): Promise<Role | null> {
  const store = await cookies();
  const value = store.get('arys_role')?.value;
  if (value === 'hr' || value === 'pbm' || value === 'subscriber') return value;
  return null;
}

/** Returns true if the current user has the given role. */
export async function requireRole(role: Role): Promise<boolean> {
  const current = await getRole();
  return current === role;
}
