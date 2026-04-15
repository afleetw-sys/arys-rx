'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const [role, setRole] = useState<'hr' | 'pbm'>('hr');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      document.cookie = `arys_role=${role}; path=/; max-age=86400`;
      router.push(role === 'hr' ? '/hr' : '/pbm');
    },
    [role, router],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4 sm:p-6">
      <div className="flex w-full max-w-[420px] flex-col gap-5">
        <div
          role="radiogroup"
          aria-label="Sign-in portal"
          className="flex rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 ring-1 ring-neutral-200/50"
        >
          <label
            className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
              role === 'hr'
                ? 'bg-white text-neutral-900 ring-1 ring-neutral-200/80'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <input
              type="radio"
              name="portal"
              value="hr"
              checked={role === 'hr'}
              onChange={() => setRole('hr')}
              className="sr-only"
            />
            HR manager
          </label>
          <label
            className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
              role === 'pbm'
                ? 'bg-white text-neutral-900 ring-1 ring-neutral-200/80'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <input
              type="radio"
              name="portal"
              value="pbm"
              checked={role === 'pbm'}
              onChange={() => setRole('pbm')}
              className="sr-only"
            />
            PBM
          </label>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 ring-1 ring-neutral-200/60 sm:p-8">
          <div className="mb-7 text-center sm:mb-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
              <span className="text-xl font-bold text-white">Rx</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Sign in</h1>
            <p className="mt-1 text-sm text-neutral-500">arys-rx employer and PBM dashboard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
