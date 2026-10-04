import {ActionForm} from '@/components/admin/ActionForm';
import {deleteSiteContentAction,saveSiteContentAction} from '../actions';
import {requireAdmin} from '@/lib/admin-auth';

export default async function Content(){
	const {supabase}=await requireAdmin();
	const {data:entries,error}=await supabase.from('site_content').select('key,value,updated_at').order('key');
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">CMS</p><h1 className="serif text-5xl mt-2">Site content</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Site content could not be loaded. Check your Supabase connection and admin RLS policy.</p>}
		<section className="card p-6 mt-8"><h2 className="serif text-2xl mb-5">Add content entry</h2><ActionForm action={saveSiteContentAction} submitLabel="Save content" className="grid gap-4">
			<label className="grid gap-1 text-sm text-muted-text">Key<input className="input" name="key" placeholder="homepage.hero" required maxLength={120}/></label><label className="grid gap-1 text-sm text-muted-text">Value (JSON object)<textarea className="input min-h-32 font-mono text-sm" name="value" defaultValue="{}" required/></label>
		</ActionForm></section>
		<div className="grid gap-4 mt-6">{error?null:entries?.length?entries.map(entry=><section className="card p-6" key={entry.key}><p className="text-xs uppercase tracking-widest text-muted-text mb-4">{entry.key}</p><ActionForm action={saveSiteContentAction} submitLabel="Update content" className="grid gap-4">
			<input type="hidden" name="key" value={entry.key}/><label className="grid gap-1 text-sm text-muted-text">Value (JSON object)<textarea className="input min-h-40 font-mono text-sm" name="value" defaultValue={JSON.stringify(entry.value,null,2)} required/></label><p className="text-xs text-muted-text">Updated {entry.updated_at?new Date(entry.updated_at).toLocaleString():'date unavailable'}</p>
		</ActionForm><ActionForm action={deleteSiteContentAction} submitLabel="Delete entry" className="mt-3"><input type="hidden" name="key" value={entry.key}/></ActionForm></section>):<p className="card p-8 text-center text-muted-text">No CMS entries yet.</p>}</div>
	</>;
}
