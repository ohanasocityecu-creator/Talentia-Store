'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signInAction } from './actions';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(signInAction, { message: '' });
  return <>
    <form action={formAction} className="grid gap-4 mt-10">
      <input type="hidden" name="next" value={nextPath}/>
      <input className="input" type="email" name="email" autoComplete="email" placeholder="Email" required/>
      <input className="input" type="password" name="password" autoComplete="current-password" placeholder="Password" required/>
      <button className="lux-btn" disabled={pending}>{pending ? 'Signing in...' : 'SIGN IN'}</button>
      {state.message && <p role="alert" className="text-muted-text">{state.message}</p>}
    </form>
    <p className="text-sm mt-5"><Link href="/forgot-password" className="underline">Forgot password?</Link> · <Link href="/signup" className="underline">Create account</Link></p>
  </>;
}
