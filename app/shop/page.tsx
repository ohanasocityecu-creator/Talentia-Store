import Link from 'next/link';
import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';

export default async function Shop(){
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
        <p className="eyebrow">Shop</p>
        <h1 className="serif mt-3 text-5xl text-text md:text-6xl">Shop All</h1>
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="bg-soft-pink border border-rose px-4 py-2 text-sm font-semibold text-burgundy">All</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="border border-border bg-white px-4 py-2 text-sm font-medium text-muted-text hover:border-rose hover:text-burgundy">
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            Sort
            <select className="input mt-2" aria-label="Sort products">
              <option>Featured</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </label>

          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            Price
            <select className="input mt-2" aria-label="Filter by price">
              <option>Any</option>
              <option>Under 250 EGP</option>
              <option>250–500 EGP</option>
            </select>
          </label>

          <label className="grid text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">
            Availability
            <select className="input mt-2" aria-label="Filter by availability">
              <option>All</option>
              <option>In stock</option>
              <option>New arrivals</option>
            </select>
          </label>

          <div className="flex items-end">
            <Link href="/shop" className="ghost-btn w-full">Clear Filters</Link>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
