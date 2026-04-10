import type { Role } from '@arys-rx/types';
import Link from 'next/link';

interface Props {
  role: Role;
  children: React.ReactNode;
}

const NAV: Record<string, { label: string; href: string }[]> = {
  hr: [{ label: 'Members', href: '/hr' }],
  pbm: [
    { label: 'Patients', href: '/pbm' },
    { label: 'Drugs', href: '/pbm/drugs' },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  hr: 'HR Portal',
  pbm: 'PBM Portal',
};

export function DashboardShell({ role, children }: Props) {
  const nav = NAV[role] ?? [];
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-brand-700 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">arys-rx</span>
          <span className="text-brand-200 text-sm">{ROLE_LABEL[role]}</span>
          <nav className="flex gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-brand-100 hover:text-white text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          href="/sign-out"
          className="text-brand-200 hover:text-white text-sm transition-colors"
        >
          Sign out
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
