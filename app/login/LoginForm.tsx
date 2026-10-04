'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signInAction } from './actions';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(signInAction, { message: '' });

  return (
    <div className="card p-6 md:p-8">
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="next" value={nextPath} />

        <div>
          <label htmlFor="login-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Email</label>
          <input id="login-email" className="input" type="email" name="email" autoComplete="email" placeholder="Email" required />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Password</label>
          <input id="login-password" className="input" type="password" name="password" autoComplete="current-password" placeholder="Password" required />
        </div>

        <button className="lux-btn" disabled={pending}>{pending ? 'Signing in...' : 'Sign In'}</button>
        {state.message && <p role="alert" className="text-sm text-muted-text">{state.message}</p>}
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-muted-text md:flex-row md:items-center md:justify-between">
        <Link href="/forgot-password" className="text-burgundy hover:text-deep-rose">Forgot password?</Link>
        <Link href="/signup" className="text-burgundy hover:text-deep-rose">Create account</Link>
      </div>
    </div>
  );
}
