import Link from 'next/link';
import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';

export default async function Home({searchParams}:{searchParams:Promise<{access?:string}>}){
	const {access}=await searchParams;
	let products:any[]=[];
	let categories:{name:string;slug:string}[]=[];
	if(supabase){
		const [productResult,categoryResult]=await Promise.all([
			supabase.from('products').select('*,categories(name,slug),product_images(id,image_url,alt_text,sort_order,is_primary)').eq('is_active',true).eq('is_new',true).order('created_at',{ascending:false}),
			supabase.from('categories').select('name,slug').eq('is_active',true).order('sort_order')
		]);
		products=productResult.data??[];
		categories=categoryResult.data??[];
	}
	return <main>
		{access==='denied'&&<div className="bg-burgundy text-white"><div className="container py-4 text-sm font-medium">Access denied. This account is not allowed to access the admin area.</div></div>}
		<section className="min-h-[78vh] bg-cream text-text relative overflow-hidden"><div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_35%,var(--color-blush),transparent_42%)]"/><div className="container min-h-[78vh] flex items-center relative"><div className="max-w-2xl"><h1 className="serif text-6xl md:text-8xl leading-[.95]">TALENTIA</h1><Link className="inline-flex mt-8 bg-burgundy text-white px-7 py-4 font-semibold hover:bg-deep-rose" href="/shop">SHOP NOW</Link></div></div></section>
		<section className="container py-24"><div className="flex justify-between items-end mb-10"><h2 className="serif text-4xl">New Arrivals</h2><Link href="/shop" className="text-sm border-b border-rose pb-1">View all</Link></div><ProductGrid products={products}/></section>
		<section className="bg-soft-pink py-24"><div className="container"><h2 className="serif text-4xl mb-10">Collections</h2>{categories.length?<div className="grid grid-cols-2 md:grid-cols-5 gap-3">{categories.map(category=><Link key={category.slug} href={`/category/${category.slug}`} className="aspect-[3/4] bg-white border border-border text-text flex items-end p-5 relative overflow-hidden transition-colors hover:border-rose"><span className="relative serif text-xl">{category.name}</span></Link>)}</div>:<p className="text-muted-text">No categories available yet.</p>}</div></section>
	</main>;
}
