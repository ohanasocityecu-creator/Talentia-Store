import {supabase} from '@/lib/supabase';
import {Media} from '@/components/Media';
import {notFound} from 'next/navigation';
import {AddToCart} from '@/components/CartActions';

export default async function Product({params}:{params:Promise<{slug:string}>}){
  const {slug} = await params;
  if (!supabase) return notFound();

  const {data: product} = await supabase
    .from('products')
    .select('*, categories(name, slug), product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!product) return notFound();

  const images = [...(product.product_images ?? [])].sort(
    (a:any, b:any) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  );
  const image = images[0]?.image_url;
  const material = product.material || 'Premium stainless steel';
  const color = product.color || 'Metallic';
  const compareAtPrice = Number(product.compare_at_price ?? 0);
  const price = Number(product.price ?? 0);
  const hasDiscount = compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <main className="container py-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="card overflow-hidden border-border">
            <Media src={image} alt={product.name} className="aspect-[4/5] w-full object-cover" priority />
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((item:any, index:number) => (
                <div key={`${item.id ?? index}`} className="card overflow-hidden border-border">
                  <Media src={item.image_url} alt={`${product.name} view ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="eyebrow">{product.categories?.name || 'Collection'}</p>
          <h1 className="serif mt-3 text-4xl text-text md:text-5xl">{product.name}</h1>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-semibold text-burgundy">{price.toLocaleString()} EGP</span>
            {hasDiscount && <del className="text-base text-muted-text">{compareAtPrice.toLocaleString()} EGP</del>}
            {hasDiscount && <span className="pill">-{discountPct}%</span>}
          </div>

          {product.description && <p className="mt-6 text-base leading-8 text-muted-text">{product.description}</p>}

          <div className="mt-8 rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-4 text-sm text-muted-text">
              <span>Availability</span>
              <span className="font-semibold text-text">{Number(product.stock_quantity ?? 0) > 0 ? `In stock · ${product.stock_quantity} available` : 'Out of stock'}</span>
            </div>
          </div>

          <div className="mt-8">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price,
                image,
                slug: product.slug,
              }}
              disabled={Number(product.stock_quantity ?? 0) <= 0}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Material</p>
              <p className="mt-2 text-base text-text">{material}</p>
            </div>
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Color</p>
              <p className="mt-2 text-base text-text">{color}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Product Details</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{product.description || 'A refined everyday accessory designed for confident styling.'}</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Material</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">{material}</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Care Instructions</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">Store dry and away from harsh chemicals to keep the finish polished.</p>
        </div>
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-text">Shipping</p>
          <p className="mt-3 text-sm leading-7 text-muted-text">Order processing and delivery details are shared at checkout.</p>
        </div>
      </div>
    </main>
  );
}
