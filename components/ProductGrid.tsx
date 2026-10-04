import {LocalizedLink as Link} from '@/components/LocalizedLink';
import {ProductCard} from './ProductCard';
import {translate, type Locale} from '@/lib/i18n';

export function ProductGrid({products=[], locale='en'}:{products?:any[]; locale?:Locale}){
  if (!products.length) {
    return (
      <div className="card p-10 text-center">
        <p className="serif text-3xl text-text">{translate(locale, 'shop.noProducts')}</p>
        <p className="mt-3 text-muted-text">{translate(locale, 'shop.newOnWay')}</p>
        <Link href="/shop" className="ghost-btn mt-6">{translate(locale, 'shop.continueBrowsing')}</Link>
      </div>
    );
  }

  return <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>;
}
