'use client';
import Link from 'next/link';
import {Heart} from 'lucide-react';
import {Media} from './Media';

export function ProductCard({p}:{p:any}){
  const images = p.product_images ?? [];
  const image = images.find((item:any) => item.is_primary)?.image_url ?? [...images].sort((a:any, b:any) => a.sort_order - b.sort_order)[0]?.image_url;
  const compareAt = Number(p.compare_at_price ?? 0);
  const price = Number(p.price ?? 0);
  const hasDiscount = compareAt > price;
  const discountPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const handleAddToBag = () => {
    const cart = JSON.parse(localStorage.getItem('talentia-cart') || '[]');
    const index = cart.findIndex((item:any) => item.id === p.id);

    if (index >= 0) cart[index].quantity += 1;
    else cart.push({ id: p.id, name: p.name, price, image, slug: p.slug, quantity: 1 });

    localStorage.setItem('talentia-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('talentia-cart-updated'));
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-white">
        <Link href={`/product/${p.slug}`} aria-label={`View ${p.name}`}>
          <Media src={image} alt={p.name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
        </Link>

        <button
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-deep-rose shadow-sm transition hover:text-burgundy"
          aria-label={`Add ${p.name} to wishlist`}
          type="button"
        >
          <Heart size={17} />
        </button>

        {p.is_new && <span className="absolute left-3 top-3 rounded-full bg-blush px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-burgundy uppercase">New</span>}
        {hasDiscount && <span className="absolute bottom-3 right-3 rounded-full bg-burgundy px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white uppercase">-{discountPct}%</span>}
      </div>

      <div className="pt-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-text">{p.categories?.name || 'Collection'}</div>
        <Link href={`/product/${p.slug}`} className="mt-2 block text-base font-medium text-text hover:text-deep-rose">
          {p.name}
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-semibold text-burgundy">{price.toLocaleString()} EGP</span>
          {hasDiscount && <del className="text-sm text-muted-text">{compareAt.toLocaleString()} EGP</del>}
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          className="mt-4 w-full border border-border bg-soft-pink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:border-rose hover:bg-blush"
        >
          Add to Bag
        </button>
      </div>
    </article>
  );
}
