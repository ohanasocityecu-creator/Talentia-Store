import Link from 'next/link';
import {requireAdmin} from '@/lib/admin-auth';

const money=(amount:number)=>`${amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} EGP`;

async function getRevenue(supabase:Awaited<ReturnType<typeof import('@/lib/supabase-server').createSupabaseServerClient>>){
	let revenue=0;
	for(let from=0;;from+=1000){
		const {data,error}=await supabase.from('orders').select('total,status,payment_status').order('created_at').range(from,from+999);
		if(error)return {revenue:null,error};
		for(const order of data??[]){
			if(order.status!=='cancelled'&&order.payment_status==='paid')revenue+=Number(order.total);
		}
		if(!data||data.length<1000)break;
	}
	return {revenue,error:null};
}

async function getLowStockCount(supabase:Awaited<ReturnType<typeof import('@/lib/supabase-server').createSupabaseServerClient>>){
	let count=0;
	for(let from=0;;from+=1000){
		const {data,error}=await supabase.from('products').select('id,stock_quantity,low_stock_threshold').eq('is_active',true).order('id').range(from,from+999);
		if(error)return {count:null,error};
		count+=(data??[]).filter(product=>product.stock_quantity<=product.low_stock_threshold).length;
		if(!data||data.length<1000)break;
	}
	return {count,error:null};
}

export default async function Admin(){
	const {supabase}=await requireAdmin();
	const [products,orders,customers,carts,wishlistItems,reviews,lowStockResult,revenueResult,recentOrders]=await Promise.all([
		supabase.from('products').select('id',{count:'exact',head:true}),
		supabase.from('orders').select('id',{count:'exact',head:true}),
		supabase.from('profiles').select('id',{count:'exact',head:true}).eq('role','customer'),
		supabase.from('carts').select('id',{count:'exact',head:true}),
		supabase.from('wishlist_items').select('product_id',{count:'exact',head:true}),
		supabase.from('reviews').select('id',{count:'exact',head:true}).eq('approved',false),
		getLowStockCount(supabase),
		getRevenue(supabase),
		supabase.from('orders').select('id,order_number,customer_name,total,status,created_at').order('created_at',{ascending:false}).limit(8),
	]);
	const errors=[products.error,orders.error,customers.error,carts.error,wishlistItems.error,reviews.error,lowStockResult.error,revenueResult.error,recentOrders.error].filter(Boolean);
	const lowStockCount=lowStockResult.count;
	const revenue=revenueResult.revenue;
	const metrics=[
		['Products',products.error?'Unavailable':products.count??0],
		['Orders',orders.error?'Unavailable':orders.count??0],
		['Customers',customers.error?'Unavailable':customers.count??0],
		['Revenue',revenue===null?'Unavailable':money(revenue)],
		['Low stock',lowStockCount??'Unavailable'],
		['Open carts',carts.error?'Unavailable':carts.count??0],
		['Wishlist items',wishlistItems.error?'Unavailable':wishlistItems.count??0],
		['Reviews awaiting moderation',reviews.error?'Unavailable':reviews.count??0],
	];
	return <>
		<div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-widest text-muted-text">LIVE STORE DATA</p><h1 className="serif text-5xl mt-2">Overview</h1></div><Link href="/admin/products/new" className="lux-btn">Add product</Link></div>
		{errors.length>0&&<p role="alert" className="mt-6 text-muted-text">Some dashboard data could not be loaded. Check the Supabase connection and admin RLS policies.</p>}
		<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-10">{metrics.map(([label,value])=><div className="card p-6" key={label}><p className="text-xs uppercase tracking-widest text-muted-text">{label}</p><b className="text-2xl mt-3 block">{value}</b></div>)}</div>
		<section className="card mt-8 p-6"><div className="flex items-center justify-between"><h2 className="serif text-2xl">Recent orders</h2><Link className="text-muted-text hover:text-text" href="/admin/orders">All orders</Link></div>{recentOrders.error?<p className="text-muted-text mt-5">Recent orders are unavailable.</p>:recentOrders.data?.length?<div className="overflow-x-auto mt-5"><table className="w-full text-left text-sm"><thead className="text-muted-text"><tr><th className="py-3">Order</th><th>Customer</th><th>Status</th><th>Date</th><th className="text-right">Total</th></tr></thead><tbody>{recentOrders.data.map(order=><tr key={order.id} className="border-t border-border"><td className="py-3"><Link className="text-text hover:text-muted-text" href={`/admin/orders/${order.id}`}>{order.order_number}</Link></td><td>{order.customer_name}</td><td className="capitalize">{order.status}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td className="text-right">{money(Number(order.total))}</td></tr>)}</tbody></table></div>:<p className="text-muted-text mt-5">No orders yet.</p>}</section>
	</>;
}
