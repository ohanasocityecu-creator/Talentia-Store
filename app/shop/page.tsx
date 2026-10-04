import Link from 'next/link';
import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';

export default async function Shop(){
	let products:any[]=[];
	let categories:{name:string;slug:string}[]=[];
	if(supabase){
		const [productResult,categoryResult]=await Promise.all([
			supabase.from('products').select('*,categories(name,slug),product_images(id,image_url,alt_text,sort_order,is_primary)').eq('is_active',true).order('created_at',{ascending:false}),
			supabase.from('categories').select('name,slug').eq('is_active',true).order('sort_order')
		]);
		products=productResult.data??[];
		categories=categoryResult.data??[];
	}
	return <main className="container py-14"><div className="mb-12"><h1 className="serif text-5xl">Shop All</h1></div><div className="flex gap-3 mb-10 overflow-x-auto"><Link href="/shop" className="bg-soft-pink text-burgundy border border-rose px-4 py-2 text-sm">All</Link>{categories.map(category=><Link key={category.slug} href={`/category/${category.slug}`} className="bg-white text-muted-text border border-border hover:border-rose hover:text-burgundy px-4 py-2 text-sm whitespace-nowrap">{category.name}</Link>)}</div><ProductGrid products={products}/></main>;
}
