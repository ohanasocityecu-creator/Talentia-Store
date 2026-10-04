import {ActionForm} from '@/components/admin/ActionForm';
import {deletePricingRuleAction,savePricingRuleAction} from '../actions';
import {requireAdmin} from '@/lib/admin-auth';

export default async function Pricing(){
	const {supabase}=await requireAdmin();
	const {data:rules,error}=await supabase.from('pricing_rules').select('id,min_quantity,max_quantity,discount_type,discount_value,priority,is_active').order('priority',{ascending:false}).order('min_quantity');
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">COMMERCE CONFIGURATION</p><h1 className="serif text-5xl mt-2">Pricing rules</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Pricing rules could not be loaded. Check your Supabase connection and RLS policy.</p>}
		<section className="card p-6 mt-8"><h2 className="serif text-2xl mb-5">Add pricing rule</h2><ActionForm action={savePricingRuleAction} submitLabel="Create rule" className="grid md:grid-cols-3 gap-4">
			<label className="grid gap-1 text-sm text-muted-text">Minimum quantity<input className="input" type="number" name="min_quantity" min="1" required/></label><label className="grid gap-1 text-sm text-muted-text">Maximum quantity<input className="input" type="number" name="max_quantity" min="1" placeholder="No maximum"/></label>
			<label className="grid gap-1 text-sm text-muted-text">Discount type<select className="input" name="discount_type"><option value="fixed">Fixed</option><option value="percentage">Percentage</option></select></label><label className="grid gap-1 text-sm text-muted-text">Discount value<input className="input" type="number" name="discount_value" min="0" step="0.01" required/></label><label className="grid gap-1 text-sm text-muted-text">Priority<input className="input" type="number" name="priority" defaultValue="0" required/></label><label className="flex gap-2 items-center text-sm"><input type="checkbox" name="is_active" defaultChecked/>Active</label>
		</ActionForm></section>
		<div className="grid gap-4 mt-6">{error?null:rules?.length?rules.map(rule=><section className="card p-6" key={rule.id}><ActionForm action={savePricingRuleAction} submitLabel="Save rule" className="grid md:grid-cols-3 gap-4">
			<input type="hidden" name="id" value={rule.id}/><label className="grid gap-1 text-sm text-muted-text">Minimum quantity<input className="input" type="number" name="min_quantity" min="1" defaultValue={rule.min_quantity} required/></label><label className="grid gap-1 text-sm text-muted-text">Maximum quantity<input className="input" type="number" name="max_quantity" min="1" defaultValue={rule.max_quantity??''} placeholder="No maximum"/></label>
			<label className="grid gap-1 text-sm text-muted-text">Discount type<select className="input" name="discount_type" defaultValue={rule.discount_type}><option value="fixed">Fixed</option><option value="percentage">Percentage</option></select></label><label className="grid gap-1 text-sm text-muted-text">Discount value<input className="input" type="number" name="discount_value" min="0" step="0.01" defaultValue={rule.discount_value} required/></label><label className="grid gap-1 text-sm text-muted-text">Priority<input className="input" type="number" name="priority" defaultValue={rule.priority} required/></label><label className="flex gap-2 items-center text-sm"><input type="checkbox" name="is_active" defaultChecked={rule.is_active}/>Active</label>
		</ActionForm><ActionForm action={deletePricingRuleAction} submitLabel="Delete rule" className="mt-3"><input type="hidden" name="id" value={rule.id}/></ActionForm></section>):<p className="card p-8 text-center text-muted-text">No pricing rules configured.</p>}</div>
	</>;
}
