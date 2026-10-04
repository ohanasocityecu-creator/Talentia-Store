'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Media} from '@/components/Media';
import {useLanguage} from '@/components/LanguageProvider';
import {formatPrice, localizedField} from '@/lib/i18n';

export default function Cart(){
  const [items, setItems] = useState<any[]>([]);
  const {locale, t} = useLanguage();

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('talentia-cart') || '[]'));
    } catch {
      setItems([]);
    }
  }, []);

  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  function update(index: number, quantity: number){
    const next = [...items];
    if (quantity <= 0) next.splice(index, 1); else next[index].quantity = quantity;
    setItems(next);
    localStorage.setItem('talentia-cart', JSON.stringify(next));
  }

  return (
    <main className="container py-14">
      <div className="mb-8">
        <p className="eyebrow">{t('cart.shoppingBag')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('cart.yourBag')}</h1>
      </div>

      {!items.length ? (
        <div className="card p-10 text-center">
          <p className="serif text-3xl text-text">{t('cart.emptyTitle')}</p>
          <p className="mt-3 text-muted-text">{t('cart.emptyDescription')}</p>
          <Link href="/shop" className="lux-btn mt-6">{t('cart.shopCollection')}</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
          <div className="grid gap-5">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="card flex gap-4 p-4">
                <Media src={item.image} alt={item.name} className="h-28 w-24 object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text">{localizedField(item, 'name', locale) ?? t('product.collection')}</h3>
                  <p className="mt-2 text-sm text-muted-text">{formatPrice(Number(item.price), locale)}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" aria-label={`${t('product.quantity')} −`} onClick={() => update(index, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center border border-border bg-soft-pink text-burgundy">−</button>
                    <span className="min-w-8 text-center text-sm font-medium text-text">{item.quantity}</span>
                    <button type="button" aria-label={`${t('product.quantity')} +`} onClick={() => update(index, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center border border-border bg-soft-pink text-burgundy">+</button>
                    <button type="button" onClick={() => update(index, 0)} className="ms-4 text-xs font-medium uppercase tracking-[0.18em] text-deep-rose hover:text-burgundy">{t('cart.remove')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="card h-fit p-7">
            <h2 className="serif text-3xl text-text">{t('cart.summary')}</h2>
            <div className="mt-7 flex items-center justify-between text-sm text-muted-text">
              <span>{t('cart.subtotal')}</span>
              <b className="text-lg text-text">{total.toLocaleString()} EGP</b>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-text">{t('cart.shippingCalculated')}</p>
            <Link href="/checkout" className="lux-btn mt-7 w-full">{t('cart.proceed')}</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
