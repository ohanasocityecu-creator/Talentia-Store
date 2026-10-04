'use client';
import Link from 'next/link';

export default function Wishlist(){
  return (
    <main className="container py-20">
      <div className="card p-10 text-center">
        <p className="eyebrow">Wishlist</p>
        <h1 className="serif mt-3 text-5xl text-text">Your Wishlist Is Empty</h1>
        <p className="mt-4 text-muted-text">Save your favorite pieces here.</p>
        <Link href="/shop" className="lux-btn mt-7">Shop Now</Link>
      </div>
    </main>
  );
}
