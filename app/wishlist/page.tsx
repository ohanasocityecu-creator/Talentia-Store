'use client';
import {LocalizedLink as Link} from '@/components/LocalizedLink';
import {useLanguage} from '@/components/LanguageProvider';

export default function Wishlist(){
  const {t} = useLanguage();
  return (
    <main className="container py-20">
      <div className="card p-10 text-center">
        <p className="eyebrow">{t('account.wishlist')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('wishlist.title')}</h1>
        <p className="mt-4 text-muted-text">{t('wishlist.description')}</p>
        <Link href="/shop" className="lux-btn mt-7">{t('wishlist.shopNow')}</Link>
      </div>
    </main>
  );
}
