import {supabase} from '@/lib/supabase';
import {Media} from '@/components/Media';
import {notFound} from 'next/navigation';
import {AddToCart} from '@/components/CartActions';
import {getLocale} from '@/lib/locale-server';
import {formatPrice, localizedCategoryName, localizedField, localePath, translate} from '@/lib/i18n';

type ProductPageProps = {params:Promise<{slug:string}>};

export async function generateMetadata({params}:ProductPageProps){
  const [{slug}, locale] = await Promise.all([params, getLocale()]);
  if (!supabase) return {title: translate(locale, 'seo.title')};
  const {data: product} = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
  if (!product) return {title: translate(locale, 'errors.notFound')};
  const name = localizedField(product, 'name', locale) ?? product.name;
  const description = localizedField(product, 'description', locale)
    ?? translate(locale, 'seo.description');
  const canonical = localePath(`/product/${slug}`, locale);
  return {
    title: `${name} | TALENTIA`,
    description,
    alternates: {
      canonical,
      languages: {
        en: localePath(`/product/${slug}`, 'en'),
        ar: localePath(`/product/${slug}`, 'ar'),
        'x-default': localePath(`/product/${slug}`, 'en'),
      },
    },
    openGraph: {
      title: `${name} | TALENTIA`,
      description,
      type: 'website',
      url: `https://talentia-store-five.vercel.app${canonical}`,
      locale: locale === 'ar' ? 'ar_EG' : 'en_EG',
    },
  };
}

export default async function Product({params}:ProductPageProps){
  const [{slug}, locale] = await Promise.all([params, getLocale()]);
  const t = (key: string) => translate(locale, key);
  if (!supabase) return notFound();

  const {data: product} = await supabase
    .from('products')
    .select('*, categories(name, slug), product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!product) return notFound();

  const productName = localizedField(product, 'name', locale) ?? product.name;
  const productDescription = localizedField(product, 'description', locale);
  const categoryName = localizedCategoryName(product.categories?.name, locale);
  const localizedMaterial = localizedField(product, 'material', locale);
  const localizedColor = localizedField(product, 'color', locale);
  const images = [...(product.product_images ?? [])].sort(
    (a:any, b:any) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  );
  const image = images[0]?.image_url;
  const material = localizedMaterial || t('product.materialDefault');
  const color = localizedColor || t('product.colorDefault');
  const compareAtPrice = Number(product.compare_at_price ?? 0);
  const price = Number(product.price ?? 0);
  const hasDiscount = compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const productUrl = `https://talentia-store-five.vercel.app${localePath(`/product/${slug}`, locale)}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription || t('product.fallbackDescription'),
    image: images.map((item: {image_url:string}) => item.image_url),
    sku: product.sku,
    brand: {'@type': 'Brand', name: 'TALENTIA'},
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'EGP',
      price: price.toFixed(2),
      availability: Number(product.stock_quantity ?? 0) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    inLanguage: locale,
  };

  return (
    <main className="container py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, '\\u003c')}}
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="card overflow-hidden border-border">
            <Media src={image} alt={productName} className="aspect-[4/5] w-full object-cover" priority />
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((item:any, index:number) => (
                <div key={`${item.id ?? index}`} className="card overflow-hidden border-border">
                  <Media src={item.image_url} alt={translate(locale, 'product.imageView', {name: productName, number: index + 1})} className="aspect-[4/5] w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="eyebrow">{categoryName || t('product.collection')}</p>
          <h1 className="serif mt-3 text-4xl text-text md:text-5xl">{productName}</h1>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-semibold text-burgundy">{formatPrice(price, locale)}</span>
            {hasDiscount && <del className="text-base text-muted-text">{formatPrice(compareAtPrice, locale)}</del>}
            {hasDiscount && <span className="pill">-{discountPct}%</span>}
          </div>

          {productDescription && <p className="mt-6 text-base leading-8 text-muted-text">{productDescription}</p>}

          <div className="mt-8 rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-4 text-sm text-muted-text">
              <span>{t('product.availability')}</span>
              <span className="font-semibold text-text">{Number(product.stock_quantity ?? 0) > 0
                ? `${t('product.inStock')} · ${product.stock_quantity} ${t('product.available')}`
                : t('product.outOfStock')}</span>
            </div>
          </div>

          <div className="mt-8">
            <AddToCart
              product={{
                id: product.id,
                name: productName,
                price,
                image,
                slug: product.slug,
              }}
              disabled={Number(product.stock_quantity ?? 0) <= 0}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.material')}</p>
              <p className="mt-2 text-base text-text">{material}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.color')}</p>
              <p className="mt-2 text-base text-text">{color}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.details')}</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{productDescription || t('product.fallbackDescription')}</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.material')}</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{material}</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.care')}</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{t('product.careDescription')}</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">{t('product.shipping')}</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{t('product.shippingDescription')}</p>
        </div>
      </div>
    </main>
  );
}
