import Link from 'next/link';
import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <main className="container py-24 text-center">
      <p className="eyebrow">{translate(locale, 'errors.notFound')}</p>
      <h1 className="serif mt-4 text-5xl text-text">{translate(locale, 'errors.notFound')}</h1>
      <Link href="/shop" className="lux-btn mt-8">{translate(locale, 'home.shopNow')}</Link>
    </main>
  );
}
