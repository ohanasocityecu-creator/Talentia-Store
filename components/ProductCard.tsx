import Link from 'next/link';
import {Heart} from 'lucide-react';
import {Media} from './Media';

export function ProductCard({p}:{p:any}){
	const images=p.product_images??[];
	const image=images.find((item:any)=>item.is_primary)?.image_url??[...images].sort((a:any,b:any)=>a.sort_order-b.sort_order)[0]?.image_url;
	return <article className="group"><div className="relative aspect-[4/5] bg-white overflow-hidden"><Link href={`/product/${p.slug}`}><Media src={image} alt={p.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]"/></Link><button className="absolute right-3 top-3 bg-white/95 p-2 rounded-full text-deep-rose hover:text-burgundy" aria-label="Add to wishlist"><Heart size={17}/></button>{p.is_new&&<span className="absolute left-3 top-3 bg-blush text-burgundy text-[10px] tracking-widest px-2 py-1">NEW</span>}</div><div className="pt-4"><div className="text-xs uppercase tracking-[.15em] text-muted-text">{p.categories?.name}</div><Link href={`/product/${p.slug}`} className="block mt-1 font-medium text-text">{p.name}</Link><div className="mt-2 flex gap-2 items-center"><span className="text-burgundy">{Number(p.price).toLocaleString()} EGP</span>{p.compare_at_price&&<del className="text-sm text-muted-text">{Number(p.compare_at_price).toLocaleString()} EGP</del>}</div></div></article>;
}
