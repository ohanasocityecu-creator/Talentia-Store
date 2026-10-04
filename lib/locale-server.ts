import { cookies } from 'next/headers';
import { isLocale, localeCookieName } from '@/lib/i18n';

export async function getLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieName)?.value;
  return isLocale(value) ? value : 'en';
}
