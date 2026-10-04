import Link from 'next/link';
import {ArrowRight, HeartHandshake, Sparkles, ShieldCheck, Truck} from 'lucide-react';
import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';

const reasons = [
  { title: 'Stainless Steel', description: 'Made for everyday wear.', icon: Sparkles },
  { title: 'Long Lasting', description: 'Designed to stay beautiful.', icon: ShieldCheck },
  { title: 'Affordable Luxury', description: 'Premium look without the premium price.', icon: HeartHandshake },
  { title: 'Easy Ordering', description: 'Simple and convenient shopping experience.', icon: Truck },
];

export default async function Home({searchParams}:{searchParams:Promise<{access?:string}>}){
  const {access} = await searchParams;
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

  const heroProduct = products[0];
  const heroImages = heroProduct?.product_images ?? [];
  const heroImage = [...heroImages].sort((a:any, b:any) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)[0]?.image_url;
  const galleryImages = products
    .flatMap((product) => product.product_images ?? [])
    .slice(0, 4)
    .map((image:any) => image.image_url)
    .filter(Boolean);

  return (
    <main className="pb-10">
      {access === 'denied' && (
        <div className="bg-burgundy text-white">
          <div className="container py-4 text-sm font-medium">Access denied. This account is not allowed to access the admin area.</div>
        </div>
      )}

      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-0 opacity-60" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(201,143,148,0.18),transparent_35%)]" />
        </div>
        <div className="container relative py-10 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="max-w-xl">
              <p className="eyebrow text-burgundy">TALENTIA</p>
              <h1 className="serif mt-6 text-5xl leading-[0.96] tracking-[-0.04em] text-text sm:text-6xl lg:text-[5.2rem]">
                Made to Shine.
                <br />
                Made to Last.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-muted-text">
                Premium stainless-steel accessories designed for everyday elegance.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/shop" className="lux-btn">Shop Now</Link>
                <Link href="#story" className="ghost-btn">Discover TALENTIA</Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 text-sm text-muted-text">
                <span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-rose" /> Stainless steel</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-rose" /> Everyday wear</span>
                <span className="inline-flex items-center gap-2"><Truck size={16} className="text-rose" /> Easy ordering</span>
              </div>
            </div>

            <div className="relative">
              <div className="card overflow-hidden border border-border bg-white">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={heroProduct?.name || 'TALENTIA product'}
                    className="aspect-[4/5] w-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-soft-pink to-cream p-8 text-center">
                    <div>
                      <p className="eyebrow text-burgundy">TALENTIA</p>
                      <p className="serif mt-4 text-4xl text-text">Made to Shine.</p>
                    </div>
                  </div>
                )}
              </div>
              {heroProduct && (
                <div className="absolute -bottom-4 left-4 rounded-full bg-white px-4 py-3 shadow-lg shadow-[rgba(122,66,74,0.12)] ring-1 ring-border">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-text">Featured</p>
                  <p className="mt-1 font-semibold text-text">{heroProduct.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section-shell">
          <div className="container">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">New Arrivals</p>
                <h2 className="serif mt-3 text-4xl text-text md:text-5xl">NEW ARRIVALS</h2>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <ProductGrid products={products.slice(0, 4)} />
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-soft-pink/70 py-20">
          <div className="container">
            <div className="mb-8">
              <p className="eyebrow">Collections</p>
              <h2 className="serif mt-3 text-4xl text-text md:text-5xl">SHOP BY CATEGORY</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className="card group overflow-hidden">
                  <div className="flex aspect-[4/5] flex-col justify-end bg-gradient-to-br from-[#fff9f7] via-[#fff6f3] to-[#f4dfe1] p-5">
                    <div className="flex items-center justify-between">
                      <span className="serif text-2xl text-text">{category.name}</span>
                      <ArrowRight size={18} className="text-burgundy transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-shell">
        <div className="container">
          <div className="mb-8 text-center">
            <p className="eyebrow">Why TALENTIA</p>
            <h2 className="serif mt-3 text-4xl text-text md:text-5xl">WHY TALENTIA?</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {reasons.map(({title, description, icon: Icon}) => (
              <div key={title} className="card p-7">
                <div className="mb-5 inline-flex rounded-full bg-soft-pink p-3 text-burgundy">
                  <Icon size={20} />
                </div>
                <h3 className="serif text-2xl text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-text">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="section-shell bg-white">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div className="card overflow-hidden border-border">
              {heroImage ? <img src={heroImage} alt="TALENTIA brand story" className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" /> : <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-soft-pink to-cream text-center"><p className="serif text-4xl text-text">TALENTIA</p></div>}
            </div>
            <div>
              <p className="eyebrow">The TALENTIA story</p>
              <h2 className="serif mt-3 text-4xl text-text md:text-5xl">PRETTY, AFFORDABLE ACCESSORIES THAT ACTUALLY LAST.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-text">
                TALENTIA is about creating pieces that feel personal, effortless, and easy to wear every day. Thoughtful details, everyday versatility, and a premium finish designed to move with your routine.
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-text">
                Discover jewellery and accessories that bring polish to the everyday without losing that soft, feminine feeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container">
          <div className="mb-8">
            <p className="eyebrow">Community</p>
            <h2 className="serif mt-3 text-4xl text-text md:text-5xl">FOLLOW @talentia.store</h2>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className="card overflow-hidden">
                  <img src={image} alt="TALENTIA collection detail" className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="serif text-3xl text-text">Your TALENTIA moments are on their way.</p>
              <p className="mt-3 text-muted-text">New media will appear here as the collection grows.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell">
        <div className="container">
          <div className="card bg-soft-pink/80 p-7 md:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow text-burgundy">Newsletter</p>
                <h2 className="serif mt-3 text-4xl text-text md:text-5xl">JOIN THE TALENTIA COMMUNITY</h2>
                <p className="mt-4 max-w-xl text-muted-text">Receive updates on new arrivals, styling ideas and upcoming drops.</p>
              </div>
              <div className="flex w-full max-w-xl gap-3">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input id="newsletter-email" className="input border-border bg-white" type="email" placeholder="Email address" aria-label="Email address" />
                <button type="button" className="lux-btn !min-w-[140px]">Join</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
