import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ActionForm} from '@/components/admin/ActionForm';
import {updateOrderStatusAction} from '../../actions';
import {requireAdmin} from '@/lib/admin-auth';

export default async function OrderDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const {supabase}=await requireAdmin();
  const {data:order,error}=await supabase.from('orders').select('*,order_items(*)').eq('id',id).maybeSingle();
  if(error)return <p role="alert" className="text-muted-text">Order details could not be loaded. Check your Supabase connection and RLS policy.</p>;
  if(!order)notFound();
  const address=order.shipping_address&&typeof order.shipping_address==='object'?order.shipping_address as Record<string,unknown>:{};
  return <>
    <Link className="text-sm text-muted-text" href="/admin/orders">Orders</Link>
    <div className="flex flex-wrap gap-4 items-end justify-between mt-2"><div><p className="text-xs uppercase tracking-widest text-muted-text">ORDER</p><h1 className="serif text-5xl">{order.order_number}</h1><p className="mt-2 text-muted-text">{new Date(order.created_at).toLocaleString()}</p></div><span className="capitalize">{order.status}</span></div>
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8"><section className="card p-6"><h2 className="serif text-2xl">Items</h2>{order.order_items?.length?<div className="overflow-x-auto mt-4"><table className="w-full text-left text-sm"><thead className="text-muted-text"><tr><th className="py-3">Item</th><th>Qty</th><th>Unit price</th><th className="text-right">Snapshot total</th></tr></thead><tbody>{order.order_items.map((item:any)=><tr className="border-t border-border" key={item.id}><td className="py-3">{item.product_name}</td><td>{item.quantity}</td><td>{Number(item.unit_price).toLocaleString()} EGP</td><td className="text-right">{Number(item.total_price).toLocaleString()} EGP</td></tr>)}</tbody></table></div>:<p className="text-muted-text mt-4">No item snapshots are available.</p>}
      <dl className="border-t border-border mt-5 pt-4 grid gap-2 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{Number(order.subtotal).toLocaleString()} EGP</dd></div><div className="flex justify-between"><dt>Discount</dt><dd>{Number(order.discount).toLocaleString()} EGP</dd></div><div className="flex justify-between"><dt>Shipping</dt><dd>{Number(order.shipping_fee).toLocaleString()} EGP</dd></div><div className="flex justify-between font-semibold text-base"><dt>Total</dt><dd>{Number(order.total).toLocaleString()} EGP</dd></div></dl>
    </section><aside className="grid gap-6 content-start"><section className="card p-6"><h2 className="serif text-2xl">Customer</h2><p className="mt-4">{order.customer_name}</p><p className="text-muted-text">{order.customer_email||'Email not recorded'}</p><p className="text-muted-text">{order.customer_phone}</p></section><section className="card p-6"><h2 className="serif text-2xl">Payment and delivery</h2><p className="mt-4">Payment status: <span className="capitalize">{order.payment_status}</span></p><p className="text-muted-text">Payment method: Not recorded</p><pre className="whitespace-pre-wrap break-words text-sm text-muted-text mt-4">{Object.entries(address).map(([key,value])=>`${key}: ${String(value)}`).join('\n')||'No shipping address recorded'}</pre>{order.notes&&<p className="mt-4">Notes: {order.notes}</p>}</section><section className="card p-6"><h2 className="serif text-2xl mb-4">Update status</h2><ActionForm action={updateOrderStatusAction} submitLabel="Update order status"><input type="hidden" name="id" value={order.id}/><select className="input" name="status" defaultValue={order.status}>{['pending','confirmed','preparing','shipped','delivered','cancelled'].map(status=><option value={status} key={status}>{status}</option>)}</select></ActionForm></section></aside></div>
  </>;
}
