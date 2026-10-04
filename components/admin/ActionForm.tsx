'use client';

import { useActionState, type ReactNode } from 'react';
import type { AdminActionState } from '@/app/admin/actions';

type AdminAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

type ActionFormProps = {
  action: AdminAction;
  children: ReactNode;
  submitLabel: string;
  className?: string;
};

export function ActionForm({ action, children, submitLabel, className = 'grid gap-4' }: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: '' });
  return <form action={formAction} className={className}>
    {children}
    <button className="lux-btn w-fit disabled:opacity-60" type="submit" disabled={pending}>{pending ? 'Saving…' : submitLabel}</button>
    {state.message && <p aria-live="polite" role="status" className={state.ok ? 'text-green-800' : 'text-rose-800'}>{state.message}</p>}
  </form>;
}
