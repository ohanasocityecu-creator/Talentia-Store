import {ProductEditor} from '@/components/admin/ProductEditor';
import {requireAdmin} from '@/lib/admin-auth';

export default async function NewProduct(){
  const {supabase}=await requireAdmin();
  const {data:categories,error}=await supabase.from('categories').select('id,name').order('name');
  if(error)return <p role="alert" className="text-muted-text">Categories could not be loaded. Try again later.</p>;
  return <ProductEditor categories={categories??[]}/>;
}
