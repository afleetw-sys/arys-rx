import { redirect } from 'next/navigation';
import { getRole } from '@/lib/auth';
import { DashboardShell } from '@/components/DashboardShell';

export default async function HrLayout({ children }: { children: React.ReactNode }) {
  const role = await getRole();
  if (role !== 'hr') redirect('/sign-in');
  return <DashboardShell role="hr">{children}</DashboardShell>;
}
