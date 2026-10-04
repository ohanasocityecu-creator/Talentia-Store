import Link from 'next/link';
import {requireAdmin} from '@/lib/admin-auth';

export default async function Products({searchParams}:{searchParams:Promise<{q?:string;status?:string;category?:string}>}){
	const {supabase}=await requireAdmin();
	const filters=await searchParams;
	const queryText=filters.q?.trim().slice(0,100)??'';
	let query=supabase.from('products').select('id,name,slug,sku,price,stock_quantity,low_stock_threshold,is_active,category_id,categories(name)').order('updated_at',{ascending:false});
	if(queryText)query=query.ilike('name',`%${queryText}%`);
	if(filters.status==='active')query=query.eq('is_active',true);
	if(filters.status==='inactive')query=query.eq('is_active',false);
	if(filters.category)query=query.eq('category_id',filters.category);
	const [productResult,categoryResult]=await Promise.all([query,supabase.from('categories').select('id,name').order('name')]);
	return <>
		<div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-widest text-muted-text">CATALOG</p><h1 className="serif text-5xl mt-2">Products</h1></div><Link className="lux-btn" href="/admin/products/new">Add product</Link></div>
		{productResult.error&&<p role="alert" className="mt-6 text-muted-text">Products could not be loaded. Verify your Supabase connection and admin RLS policy.</p>}
		{categoryResult.error&&<p role="alert" className="mt-3 text-muted-text">Category filters are unavailable.</p>}
		<form className="card mt-8 p-4 flex flex-wrap gap-3 items-end" action="/admin/products">
			<label className="grid gap-1 text-sm text-muted-text">Search<input className="input min-w-56" type="search" name="q" defaultValue={queryText} placeholder="Name"/></label>
			<label className="grid gap-1 text-sm text-muted-text">Status<select className="input" name="status" defaultValue={filters.status??'all'}><option value="all">All</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
			<label className="grid gap-1 text-sm text-muted-text">Category<select className="input" name="category" defaultValue={filters.category??''}><option value="">All categories</option>{(categoryResult.data??[]).map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
			<button className="lux-btn" type="submit">Apply filters</button>
		</form>
		<div className="card mt-5 overflow-x-auto">{productResult.error?null:productResult.data?.length?<table className="w-full text-left text-sm"><thead className="text-muted-text"><tr><th className="p-4">Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>{productResult.data.map(product=><tr key={product.id} className="border-t border-border"><td className="p-4"><Link className="text-text hover:text-muted-text" href={`/admin/products/${product.id}`}>{product.name}</Link></td><td>{product.sku}</td><td>{product.categories?.[0]?.name??'Uncategorized'}</td><td>{Number(product.price).toLocaleString()} EGP</td><td className={product.stock_quantity<=product.low_stock_threshold?'text-muted-text':''}>{product.stock_quantity}</td><td>{product.is_active?'Active':'Inactive'}</td><td className="p-4 text-right"><Link className="text-muted-text hover:text-text" href={`/admin/products/${product.id}`}>Edit</Link></td></tr>)}</tbody></table>:<p className="p-8 text-center text-muted-text">No products found.</p>}</div>
	</>;
}
