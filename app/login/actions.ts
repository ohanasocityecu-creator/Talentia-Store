'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export type LoginActionState = { message: string };

export async function signInAction(_previous: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const locale = await getLocale();
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1), next: z.string() }).safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    next: String(formData.get('next') ?? '/admin'),
  });
  if (!parsed.success) return { message: translate(locale, 'auth.invalidCredentials') };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { message: translate(locale, 'auth.signInFailed') };

  const destination = parsed.data.next.startsWith('/') && !parsed.data.next.startsWith('//') ? parsed.data.next : '/admin';
  redirect(destination);
}
