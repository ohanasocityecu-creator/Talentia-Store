import {supabase} from '@/lib/supabase';
import {Media} from '@/components/Media';
import {notFound} from 'next/navigation';
import {AddToCart} from '@/components/CartActions';

export default async function Product({params}:{params:Promise<{slug:string}>}){
	const {slug}=await params;
	if(!supabase)return notFound();
	const {data:product}=await supabase.from('products').select('*,categories(name,slug),product_images(*)').eq('slug',slug).eq('is_active',true).maybeSingle();
	if(!product)return notFound();
	const image=[...(product.product_images??[])].sort((a,b)=>Number(b.is_primary)-Number(a.is_primary)||a.sort_order-b.sort_order)[0]?.image_url;
	return <main className="container py-14"><div className="grid md:grid-cols-2 gap-12"><div className="aspect-[4/5] bg-white border border-border"><Media src={image} alt={product.name} className="w-full h-full object-cover"/></div><div className="py-5"><p className="text-xs tracking-[.2em] text-muted-text">{product.categories?.name}</p><h1 className="serif text-5xl mt-3 text-text">{product.name}</h1><div className="mt-5 text-xl text-burgundy">{Number(product.price).toLocaleString()} EGP {product.compare_at_price&&<del className="text-sm text-muted-text ml-2">{Number(product.compare_at_price).toLocaleString()} EGP</del>}</div>{product.description&&<p className="mt-7 text-muted-text leading-7">{product.description}</p>}<div className="mt-7 border-y py-5 text-sm">{product.stock_quantity>0?<span>IN STOCK · {product.stock_quantity} available</span>:<span>OUT OF STOCK</span>}</div><AddToCart product={{id:product.id,name:product.name,price:Number(product.price),image,slug:product.slug}} disabled={product.stock_quantity<=0}/></div></div></main>;
}
