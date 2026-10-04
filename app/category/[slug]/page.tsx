import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';
import {notFound} from 'next/navigation';
import {getLocale} from '@/lib/locale-server';
import {localizedCategoryName, translate} from '@/lib/i18n';

export default async function Category({params}:{params:Promise<{slug:string}>}){
  const [{slug}, locale] = await Promise.all([params, getLocale()]);
  if (!supabase) return <main className="container py-14"><p className="text-muted-text">{translate(locale, 'shop.comingSoon')}</p></main>;

  let products:any[] = [];
  let categoryName = slug;

  const [categoryResult, productResult] = await Promise.all([
    supabase.from('categories').select('name').eq('slug', slug).eq('is_active', true).maybeSingle(),
    supabase.from('products').select('*, categories!inner(name, slug), product_images(id, image_url, alt_text, sort_order, is_primary)').eq('categories.slug', slug).eq('is_active', true),
  ]);

  if (!categoryResult.data) notFound();

  categoryName = localizedCategoryName(categoryResult.data.name, locale);
  products = productResult.data ?? [];

  return (
    <main className="container py-14">
      <p className="eyebrow">{translate(locale, 'shop.collection')}</p>
      <h1 className="serif mt-3 text-5xl text-text md:text-6xl">{categoryName}</h1>
      <div className="mt-10">
        <ProductGrid products={products} locale={locale} />
      </div>
    </main>
  );
}
