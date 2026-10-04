import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase-server';

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect('/login?next=%2Fadmin');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError && profileError.code !== 'PGRST116') {
    throw new Error('Could not verify administrator access.');
  }

  if (!profile || profile.role !== 'admin') {
    redirect('/?access=denied');
  }

  return { supabase, user, profile };
}
