import Link from 'next/link';
import {requireAdmin} from '@/lib/admin-auth';

export default async function Orders({searchParams}:{searchParams:Promise<{q?:string;status?:string}>}){
	const {supabase}=await requireAdmin();
	const filters=await searchParams;
	const search=filters.q?.trim().slice(0,80)??'';
	let query=supabase.from('orders').select('id,order_number,customer_name,customer_email,customer_phone,status,payment_status,subtotal,discount,shipping_fee,total,created_at').order('created_at',{ascending:false}).limit(100);
	if(search)query=query.ilike('order_number',`%${search}%`);
	if(filters.status)query=query.eq('status',filters.status);
	const {data:orders,error}=await query;
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">COMMERCE</p><h1 className="serif text-5xl mt-2">Orders</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Orders could not be loaded. Check your Supabase connection and admin RLS policy.</p>}
		<form action="/admin/orders" className="card p-4 mt-8 flex flex-wrap gap-3 items-end"><label className="grid gap-1 text-sm text-muted-text">Order number<input className="input" name="q" defaultValue={search} placeholder="Search orders"/></label><label className="grid gap-1 text-sm text-muted-text">Status<select className="input" name="status" defaultValue={filters.status??''}><option value="">All statuses</option>{['pending','confirmed','preparing','shipped','delivered','cancelled'].map(status=><option key={status} value={status}>{status}</option>)}</select></label><button className="lux-btn">Filter</button></form>
		<div className="card mt-5 overflow-x-auto">{error?null:orders?.length?<table className="w-full text-left text-sm"><thead className="text-muted-text"><tr><th className="p-4">Order</th><th>Customer</th><th>Status</th><th>Payment</th><th>Date</th><th className="text-right">Total</th></tr></thead><tbody>{orders.map(order=><tr key={order.id} className="border-t border-border"><td className="p-4"><Link className="text-text hover:text-muted-text" href={`/admin/orders/${order.id}`}>{order.order_number}</Link></td><td>{order.customer_name}</td><td className="capitalize">{order.status}</td><td className="capitalize">{order.payment_status}</td><td>{new Date(order.created_at).toLocaleString()}</td><td className="text-right pr-4">{Number(order.total).toLocaleString()} EGP</td></tr>)}</tbody></table>:<p className="p-8 text-center text-muted-text">No orders found.</p>}</div>
	</>;
}
