import { redirect } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default async function HomePage() {
  const role = await getRole();
  if (role === 'hr') redirect('/hr');
  if (role === 'pbm') redirect('/pbm');
  redirect('/sign-in');
}
