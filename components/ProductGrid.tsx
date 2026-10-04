import Link from 'next/link';
import {ProductCard} from './ProductCard';

export function ProductGrid({products=[]}:{products?:any[]}){
  if (!products.length) {
    return (
      <div className="card p-10 text-center">
        <p className="serif text-3xl text-text">No pieces available right now.</p>
        <p className="mt-3 text-muted-text">New arrivals are on the way.</p>
        <Link href="/shop" className="ghost-btn mt-6">Continue Browsing</Link>
      </div>
    );
  }

  return <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>;
}
