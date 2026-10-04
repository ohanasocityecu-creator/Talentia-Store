import {notFound} from 'next/navigation';
import {ProductEditor} from '@/components/admin/ProductEditor';
import {requireAdmin} from '@/lib/admin-auth';

export default async function EditProduct({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const {supabase}=await requireAdmin();
  const [productResult,categoryResult]=await Promise.all([
    supabase.from('products').select('*,product_images(id,image_url,sort_order,is_primary),product_variants(*)').eq('id',id).maybeSingle(),
    supabase.from('categories').select('id,name').order('name'),
  ]);
  if(productResult.error||categoryResult.error)return <p role="alert" className="text-muted-text">Product data could not be loaded. Check the database connection and try again.</p>;
  if(!productResult.data)notFound();
  return <ProductEditor product={productResult.data} categories={categoryResult.data??[]}/>;
}
