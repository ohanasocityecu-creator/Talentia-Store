import Link from 'next/link';
import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default async function Account(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  return (
    <main className="container py-20">
      <div className="mb-8">
        <p className="eyebrow">{t('account.account')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('account.myAccount')}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {key: 'orders', label: t('account.orders'), href: '/account/orders'},
          {key: 'wishlist', label: t('account.wishlist'), href: '/wishlist'},
          {key: 'profile', label: t('account.profile'), href: '/account'},
          {key: 'addresses', label: t('account.addresses'), href: '/account'},
        ].map((item) => (
          <Link key={item.key} href={item.href} className="card p-7 transition hover:border-rose">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{item.label}</p>
            <p className="serif mt-3 text-2xl text-text">{item.label}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
