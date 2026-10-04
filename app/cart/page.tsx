'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {Media} from '@/components/Media';

export default function Cart(){
  const [items, setItems] = useState<any[]>([]);

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
        <p className="eyebrow">Shopping bag</p>
        <h1 className="serif mt-3 text-5xl text-text">Your Bag</h1>
      </div>

      {!items.length ? (
        <div className="card p-10 text-center">
          <p className="serif text-3xl text-text">Your bag is waiting for something special.</p>
          <p className="mt-3 text-muted-text">Explore the collection and find your next everyday favourite.</p>
          <Link href="/shop" className="lux-btn mt-6">Shop Collection</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
          <div className="grid gap-5">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="card flex gap-4 p-4">
                <Media src={item.image} alt={item.name} className="h-28 w-24 object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted-text">{Number(item.price).toLocaleString()} EGP</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" onClick={() => update(index, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center border border-border bg-soft-pink text-burgundy">−</button>
                    <span className="min-w-8 text-center text-sm font-medium text-text">{item.quantity}</span>
                    <button type="button" onClick={() => update(index, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center border border-border bg-soft-pink text-burgundy">+</button>
                    <button type="button" onClick={() => update(index, 0)} className="ml-4 text-xs font-medium uppercase tracking-[0.18em] text-deep-rose hover:text-burgundy">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="card h-fit p-7">
            <h2 className="serif text-3xl text-text">Summary</h2>
            <div className="mt-7 flex items-center justify-between text-sm text-muted-text">
              <span>Subtotal</span>
              <b className="text-lg text-text">{total.toLocaleString()} EGP</b>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-text">Shipping and quantity-based pricing are calculated at checkout.</p>
            <Link href="/checkout" className="lux-btn mt-7 w-full">Checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
