import { redirect } from 'next/navigation';
import { getRole } from '@/lib/auth';
import { DashboardShell } from '@/components/DashboardShell';

export default async function PbmLayout({ children }: { children: React.ReactNode }) {
  const role = await getRole();
  if (role !== 'pbm') redirect('/sign-in');
  return <DashboardShell role="pbm">{children}</DashboardShell>;
}
