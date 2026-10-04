import {ActionForm} from '@/components/admin/ActionForm';
import {deleteShippingZoneAction,saveShippingZoneAction} from '../actions';
import {requireAdmin} from '@/lib/admin-auth';

export default async function Shipping(){
	const {supabase}=await requireAdmin();
	const {data:zones,error}=await supabase.from('shipping_zones').select('id,name,shipping_fee,free_shipping_threshold,is_active,delivery_notes').order('name');
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">COMMERCE CONFIGURATION</p><h1 className="serif text-5xl mt-2">Shipping zones</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Shipping zones could not be loaded. Check your Supabase connection and RLS policy.</p>}
		<section className="card p-6 mt-8"><h2 className="serif text-2xl mb-5">Add shipping zone</h2><ActionForm action={saveShippingZoneAction} submitLabel="Create zone" className="grid md:grid-cols-2 gap-4">
			<input className="input" name="name" placeholder="Zone name" aria-label="Zone name" required maxLength={120}/><label className="grid gap-1 text-sm text-muted-text">Shipping fee<input className="input" name="shipping_fee" type="number" min="0" step="0.01" required/></label>
			<label className="grid gap-1 text-sm text-muted-text">Free shipping threshold<input className="input" name="free_shipping_threshold" type="number" min="0" step="0.01"/></label><label className="flex gap-2 items-center text-sm"><input type="checkbox" name="is_active" defaultChecked/>Active</label><textarea className="input md:col-span-2" name="delivery_notes" placeholder="Delivery notes" maxLength={2000}/>
		</ActionForm></section>
		<div className="grid gap-4 mt-6">{error?null:zones?.length?zones.map(zone=><section className="card p-6" key={zone.id}><ActionForm action={saveShippingZoneAction} submitLabel="Save zone" className="grid md:grid-cols-2 gap-4">
			<input type="hidden" name="id" value={zone.id}/><input className="input" name="name" defaultValue={zone.name} aria-label="Zone name" required/><label className="grid gap-1 text-sm text-muted-text">Shipping fee<input className="input" name="shipping_fee" type="number" min="0" step="0.01" defaultValue={zone.shipping_fee} required/></label>
			<label className="grid gap-1 text-sm text-muted-text">Free shipping threshold<input className="input" name="free_shipping_threshold" type="number" min="0" step="0.01" defaultValue={zone.free_shipping_threshold??''}/></label><label className="flex gap-2 items-center text-sm"><input type="checkbox" name="is_active" defaultChecked={zone.is_active}/>Active</label><textarea className="input md:col-span-2" name="delivery_notes" defaultValue={zone.delivery_notes??''} placeholder="Delivery notes"/>
		</ActionForm><ActionForm action={deleteShippingZoneAction} submitLabel="Delete zone" className="mt-3"><input type="hidden" name="id" value={zone.id}/></ActionForm></section>):<p className="card p-8 text-center text-muted-text">No shipping zones configured.</p>}</div>
	</>;
}
