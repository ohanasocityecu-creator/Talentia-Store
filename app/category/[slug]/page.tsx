import {ProductGrid} from '@/components/ProductGrid';
import {supabase} from '@/lib/supabase';
import {notFound} from 'next/navigation';

export default async function Category({params}:{params:Promise<{slug:string}>}){
	const {slug}=await params;
	if(!supabase)return <main className="container py-14"><p className="text-muted-text">No categories available yet.</p></main>;
	let products:any[]=[];
	let categoryName=slug;
	const [categoryResult,productResult]=await Promise.all([
		supabase.from('categories').select('name').eq('slug',slug).eq('is_active',true).maybeSingle(),
		supabase.from('products').select('*,categories!inner(name,slug),product_images(id,image_url,alt_text,sort_order,is_primary)').eq('categories.slug',slug).eq('is_active',true)
	]);
	if(!categoryResult.data)notFound();
	categoryName=categoryResult.data.name;
	products=productResult.data??[];
	return <main className="container py-14"><p className="text-xs tracking-[.25em] text-muted-text">COLLECTION</p><h1 className="serif text-5xl mt-2">{categoryName}</h1><div className="mt-12"><ProductGrid products={products}/></div></main>;
}
