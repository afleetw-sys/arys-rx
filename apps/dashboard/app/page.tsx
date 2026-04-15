import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Always land on sign-in first.
  redirect('/sign-in');
}
