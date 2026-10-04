'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useLanguage} from '@/components/LanguageProvider';

export default function Checkout(){
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const {t} = useLanguage();

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('talentia-cart') || '[]'));
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  if (!loaded) return <main className="container py-24 text-center"><p className="text-muted-text">{t('checkout.loading')}</p></main>;

  if (!items.length) {
    return (
      <main className="container py-24 text-center">
        <p className="eyebrow">{t('checkout.checkout')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('cart.empty')}</h1>
        <Link href="/shop" className="lux-btn mt-8">{t('cart.shopCollection')}</Link>
      </main>
    );
  }

  return (
    <main className="container py-14">
      <div className="mb-8">
        <p className="eyebrow">{t('checkout.checkout')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('checkout.securePieces')}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
        <form onSubmit={(event) => event.preventDefault()} className="grid gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="full-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.fullName')}</label>
              <input id="full-name" className="input" required placeholder={t('checkout.fullName')} />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.phone')}</label>
              <input id="phone" className="input" required placeholder={t('checkout.phone')} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.email')}</label>
            <input id="email" className="input" type="email" required placeholder={t('checkout.email')} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="governorate" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.governorate')}</label>
              <input id="governorate" className="input" required placeholder={t('checkout.governorate')} />
            </div>
            <div>
              <label htmlFor="city" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.city')}</label>
              <input id="city" className="input" required placeholder={t('checkout.city')} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.address')}</label>
            <input id="address" className="input" required placeholder={t('checkout.address')} />
          </div>

          <div>
            <label htmlFor="building" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.building')}</label>
            <input id="building" className="input" placeholder={t('checkout.building')} />
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('checkout.notes')}</label>
            <textarea id="notes" className="input min-h-28" placeholder={t('checkout.notes')} />
          </div>

          <div className="rounded-xl border border-border bg-soft-pink p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy">{t('checkout.paymentMethod')}</p>
            <p className="mt-2 text-sm text-muted-text">{t('checkout.cashOnDelivery')}</p>
          </div>

          <button className="lux-btn" type="button" disabled>{t('checkout.placeOrder')}</button>
        </form>

        <aside className="card h-fit p-7">
          <h2 className="serif text-3xl text-text">{t('checkout.orderSummary')}</h2>
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.quantity}`} className="flex items-center justify-between gap-3 text-sm text-muted-text">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium text-text">{(Number(item.price) * Number(item.quantity)).toLocaleString()} EGP</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between text-sm text-muted-text">
              <span>{t('cart.subtotal')}</span>
              <span className="text-lg font-semibold text-text">{subtotal.toLocaleString()} EGP</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
