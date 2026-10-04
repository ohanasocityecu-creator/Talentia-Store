'use client';
import Link from 'next/link';

export function Footer(){
  return (
    <footer className="mt-24 border-t border-border bg-[#f7efef] text-text">
      <div className="container grid gap-10 py-16 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <div className="serif text-3xl tracking-[0.16em] text-text">TALENTIA</div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-text">Made to Shine. Made to Last.</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy">Shop</h3>
          <div className="grid gap-2 text-sm text-muted-text">
            <Link href="/shop" className="hover:text-deep-rose">New Arrivals</Link>
            <Link href="/shop" className="hover:text-deep-rose">All Accessories</Link>
            <Link href="/shop" className="hover:text-deep-rose">Shop All</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy">Help</h3>
          <div className="grid gap-2 text-sm text-muted-text">
            <Link href="/track-order" className="hover:text-deep-rose">Track Order</Link>
            <Link href="/account" className="hover:text-deep-rose">Account</Link>
            <Link href="/wishlist" className="hover:text-deep-rose">Wishlist</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-burgundy">Follow</h3>
          <div className="grid gap-2 text-sm text-muted-text">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>TikTok</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-4 py-7 text-center text-xs text-muted-text md:flex-row md:items-center md:justify-between md:text-left">
          <p>© 2026 TALENTIA. All rights reserved.</p>
          <div className="flex w-full max-w-md gap-2 md:justify-end">
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input id="footer-email" className="input border-border bg-white" type="email" placeholder="Email address" aria-label="Email address" />
            <button type="button" className="lux-btn !px-4 !py-3 !text-[10px]">Join</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
