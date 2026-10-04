import {requireAdmin} from '@/lib/admin-auth';

export default async function Customers(){
	const {supabase}=await requireAdmin();
	const {data:profiles,error}=await supabase.from('profiles').select('id,full_name,phone,role,created_at,orders(count)').eq('role','customer').order('created_at',{ascending:false}).limit(200);
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">CUSTOMER PROFILES</p><h1 className="serif text-5xl mt-2">Customers</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Customer profiles could not be loaded. Check the admin RLS policy.</p>}
		<div className="card mt-8 overflow-x-auto">{error?null:profiles?.length?<table className="w-full text-left text-sm"><thead className="text-muted-text"><tr><th className="p-4">Name</th><th>Phone</th><th>Orders</th><th>Joined</th></tr></thead><tbody>{profiles.map(profile=><tr className="border-t border-border" key={profile.id}><td className="p-4">{profile.full_name||'Name not provided'}</td><td>{profile.phone||'Not provided'}</td><td>{profile.orders?.[0]?.count??0}</td><td>{profile.created_at?new Date(profile.created_at).toLocaleDateString():'—'}</td></tr>)}</tbody></table>:<p className="p-8 text-center text-muted-text">No customer profiles yet.</p>}</div>
		<p className="text-xs text-muted-text mt-4">Authentication credentials and private Auth metadata are not exposed in this dashboard.</p>
	</>;
}
