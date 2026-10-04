'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type LoginActionState = { message: string };

export async function signInAction(_previous: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1), next: z.string() }).safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    next: String(formData.get('next') ?? '/admin'),
  });
  if (!parsed.success) return { message: 'Enter a valid email and password.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { message: 'Sign-in failed. Check your credentials and try again.' };

  const destination = parsed.data.next.startsWith('/') && !parsed.data.next.startsWith('//') ? parsed.data.next : '/admin';
  redirect(destination);
}
