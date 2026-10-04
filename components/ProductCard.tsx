'use client';
import {LocalizedLink as Link} from '@/components/LocalizedLink';
import {Heart} from 'lucide-react';
import {Media} from './Media';
import {useLanguage} from '@/components/LanguageProvider';
import {formatPrice, localizedCategoryName, localizedField} from '@/lib/i18n';

export function ProductCard({p}:{p:any}){
  const {locale, t} = useLanguage();
  const images = p.product_images ?? [];
  const image = images.find((item:any) => item.is_primary)?.image_url ?? [...images].sort((a:any, b:any) => a.sort_order - b.sort_order)[0]?.image_url;
  const compareAt = Number(p.compare_at_price ?? 0);
  const price = Number(p.price ?? 0);
  const name = localizedField(p, 'name', locale) ?? '';
  const categoryName = localizedCategoryName(p.categories?.name, locale, p.categories);
  const hasDiscount = compareAt > price;
  const discountPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const handleAddToBag = () => {
    const cart = JSON.parse(localStorage.getItem('talentia-cart') || '[]');
    const index = cart.findIndex((item:any) => item.id === p.id);

    if (index >= 0) cart[index].quantity += 1;
    else cart.push({ id: p.id, name, price, image, slug: p.slug, quantity: 1 });

    localStorage.setItem('talentia-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('talentia-cart-updated'));
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-white">
        <Link href={`/product/${p.slug}`} aria-label={t('product.viewProduct', {name})}>
          <Media src={image} alt={name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
        </Link>

        <button
          className="absolute end-3 top-3 rounded-full bg-white/95 p-2 text-deep-rose shadow-sm transition hover:text-burgundy"
          aria-label={t('product.addWishlist', {name})}
          type="button"
        >
          <Heart size={17} />
        </button>

        {p.is_new && <span className="absolute start-3 top-3 rounded-full bg-blush px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-burgundy uppercase">{t('product.new')}</span>}
        {hasDiscount && <span className="absolute bottom-3 end-3 rounded-full bg-burgundy px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white uppercase">-{discountPct}%</span>}
      </div>

      <div className="pt-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-text">{categoryName || t('product.collection')}</div>
        <Link href={`/product/${p.slug}`} className="mt-2 block text-base font-medium text-text hover:text-deep-rose">
          {name}
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-semibold text-burgundy">{formatPrice(price, locale)}</span>
          {hasDiscount && <del className="text-sm text-muted-text">{formatPrice(compareAt, locale)}</del>}
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          className="mt-4 w-full border border-border bg-soft-pink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-burgundy transition hover:border-rose hover:bg-blush"
        >
          {t('product.addToBag')}
        </button>
      </div>
    </article>
  );
}
