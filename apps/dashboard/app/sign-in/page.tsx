'use client';

import { useRouter } from 'next/navigation';

/** Prototype sign-in: select a role and get a cookie — no real auth needed. */
export default function SignInPage() {
  const router = useRouter();

  function signIn(role: 'hr' | 'pbm') {
    document.cookie = `arys_role=${role}; path=/; max-age=86400`;
    router.push(role === 'hr' ? '/hr' : '/pbm');
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">Rx</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">arys-rx Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Select your role to continue</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn('hr')}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-white font-semibold hover:bg-brand-700 transition-colors"
          >
            Sign in as HR
          </button>
          <button
            onClick={() => signIn('pbm')}
            className="w-full rounded-xl bg-neutral-100 border border-neutral-200 px-4 py-3 text-neutral-800 font-semibold hover:bg-neutral-200 transition-colors"
          >
            Sign in as PBM
          </button>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Prototype mode — no credentials required
        </p>
      </div>
    </div>
  );
}
