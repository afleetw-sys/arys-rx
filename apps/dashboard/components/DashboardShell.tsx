import type { Role } from '@arys-rx/types';
import Link from 'next/link';

interface Props {
  role: Role;
  children: React.ReactNode;
}

/** Add items here when new top-level sections exist; home is the wordmark link. */
const NAV: Record<string, { label: string; href: string }[]> = {
  hr: [],
  pbm: [],
};

function roleWordmark(role: Role): string {
  if (role === 'hr') return 'HR';
  if (role === 'pbm') return 'PBM';
  return '';
}

function homeHref(role: Role): string {
  if (role === 'hr') return '/hr';
  if (role === 'pbm') return '/pbm';
  return '/sign-in';
}

export function DashboardShell({ role, children }: Props) {
  const nav = NAV[role] ?? [];
  const mark = roleWordmark(role);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
            <Link
              href={homeHref(role)}
              className="inline-flex items-baseline gap-1.5 no-underline"
            >
              <span className="text-lg font-bold tracking-tight text-neutral-900">arys-rx</span>
              {mark ? (
                <span className="text-lg font-semibold tracking-tight text-brand-600">{mark}</span>
              ) : null}
            </Link>
            {nav.length > 0 ? (
              <nav className="flex gap-1 sm:gap-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:px-0 sm:py-0 sm:hover:bg-transparent"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
          <a
            href="/api/auth/sign-out"
            className="shrink-0 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Sign out
          </a>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
