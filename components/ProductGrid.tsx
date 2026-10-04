import {ProductCard} from './ProductCard';

export function ProductGrid({products=[]}:{products?:any[]}){
	if(!products.length)return <p className="py-12 text-center text-muted-text">No products available yet.</p>;
	return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">{products.map(p=><ProductCard key={p.id} p={p}/>)}</div>;
}
