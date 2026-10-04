import {ActionForm} from '@/components/admin/ActionForm';
import {requireAdmin} from '@/lib/admin-auth';
import {saveCategoryAction,deleteCategoryAction} from '../actions';

export default async function Categories(){
	const {supabase}=await requireAdmin();
	const {data:categories,error}=await supabase.from('categories').select('id,name,slug,description,image_url,is_active,sort_order').order('sort_order').order('name');
	return <>
		<div><p className="text-xs uppercase tracking-widest text-muted-text">CATALOG</p><h1 className="serif text-5xl mt-2">Categories</h1></div>
		{error&&<p role="alert" className="mt-6 text-muted-text">Categories could not be loaded. Check your Supabase connection and RLS policies.</p>}
		<section className="card p-6 mt-8"><h2 className="serif text-2xl mb-5">Add category</h2><ActionForm action={saveCategoryAction} submitLabel="Create category" className="grid md:grid-cols-2 gap-4">
			<input className="input" name="name" placeholder="Name" aria-label="Category name" required maxLength={120}/><input className="input" name="slug" placeholder="slug" aria-label="Category slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"/>
			<input className="input" name="image_url" type="url" placeholder="Supabase Storage image URL" aria-label="Category image URL"/><input className="input" name="sort_order" type="number" defaultValue="0" aria-label="Sort order"/>
			<textarea className="input md:col-span-2" name="description" placeholder="Description" aria-label="Description" maxLength={2000}/><label className="flex gap-2 items-center text-sm"><input name="is_active" type="checkbox" defaultChecked/>Active</label>
		</ActionForm></section>
		<div className="grid gap-4 mt-8">{error?null:categories?.length?categories.map(category=><section className="card p-6" key={category.id}><ActionForm action={saveCategoryAction} submitLabel="Save category" className="grid md:grid-cols-2 gap-4">
			<input type="hidden" name="id" value={category.id}/><input className="input" name="name" defaultValue={category.name} aria-label="Category name" required/><input className="input" name="slug" defaultValue={category.slug} aria-label="Category slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"/>
			<input className="input" name="image_url" type="url" defaultValue={category.image_url??''} placeholder="Supabase Storage image URL" aria-label="Category image URL"/><input className="input" name="sort_order" type="number" defaultValue={category.sort_order} aria-label="Sort order"/>
			<textarea className="input md:col-span-2" name="description" defaultValue={category.description??''} aria-label="Description"/><label className="flex gap-2 items-center text-sm"><input name="is_active" type="checkbox" defaultChecked={category.is_active}/>Active</label>
		</ActionForm><ActionForm action={deleteCategoryAction} submitLabel="Delete category" className="mt-3"><input type="hidden" name="id" value={category.id}/></ActionForm></section>):<p className="card p-8 text-center text-muted-text">No categories yet.</p>}</div>
	</>;
}
