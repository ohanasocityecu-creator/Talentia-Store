import Link from 'next/link';
import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';
import {getLocale} from '@/lib/locale-server';
import {localizedCategoryName, translate} from '@/lib/i18n';

export default async function Shop(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  let products:any[] = [];
  let categories:{name:string;slug:string}[] = [];

  if (supabase) {
    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(name, slug), product_images(id, image_url, alt_text, sort_order, is_primary)')
        .eq('is_active', true)
        .order('created_at', {ascending: false}),
      supabase.from('categories').select('name, slug').eq('is_active', true).order('sort_order'),
    ]);

    products = productResult.data ?? [];
    categories = categoryResult.data ?? [];
  }

  return (
    <main className="container py-14">
      <div className="mb-8">
        <p className="eyebrow">{t('shop.shop')}</p>
        <h1 className="serif mt-3 text-5xl text-text md:text-6xl">{t('shop.shopAll')}</h1>
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="bg-soft-pink border border-rose px-4 py-2 text-sm font-semibold text-burgundy">{t('shop.all')}</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="border border-border bg-white px-4 py-2 text-sm font-medium text-muted-text hover:border-rose hover:text-burgundy">
              {localizedCategoryName(category.name, locale)}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            {t('shop.sort')}
            <select className="input mt-2" aria-label={t('shop.sort')}>
              <option>{t('shop.featured')}</option>
              <option>{t('shop.newest')}</option>
              <option>{t('shop.priceLow')}</option>
              <option>{t('shop.priceHigh')}</option>
            </select>
          </label>

          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            {t('shop.price')}
            <select className="input mt-2" aria-label={t('shop.price')}>
              <option>{t('shop.anyPrice')}</option>
              <option>{t('shop.under250')}</option>
              <option>{t('shop.price250to500')}</option>
            </select>
          </label>

          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            {t('shop.availability')}
            <select className="input mt-2" aria-label={t('shop.availability')}>
              <option>{t('shop.allItems')}</option>
              <option>{t('shop.inStock')}</option>
              <option>{t('shop.newArrivals')}</option>
            </select>
          </label>

          <div className="flex items-end">
            <Link href="/shop" className="ghost-btn w-full">{t('shop.clearFilters')}</Link>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <ProductGrid products={products} locale={locale} />
      </div>
    </main>
  );
}
