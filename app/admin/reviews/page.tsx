import Link from 'next/link';
import {ActionForm} from '@/components/admin/ActionForm';
import {setReviewApprovedAction} from '../actions';
import {requireAdmin} from '@/lib/admin-auth';

const relationOne=(value:any)=>Array.isArray(value)?value[0]:value;

export default async function Reviews({searchParams}:{searchParams:Promise<{status?:string}>}){
  const {supabase}=await requireAdmin();
  const {status}=await searchParams;
  let query=supabase.from('reviews').select('id,product_id,user_id,rating,review_text,approved,created_at,products(name),profiles(full_name)').order('created_at',{ascending:false}).limit(100);
  if(status==='pending')query=query.eq('approved',false);
  if(status==='approved')query=query.eq('approved',true);
  const {data:reviews,error}=await query;
  return <>
    <div><p className="text-xs uppercase tracking-widest text-muted-text">MODERATION</p><h1 className="serif text-5xl mt-2">Reviews</h1></div>
    {error&&<p role="alert" className="mt-6 text-muted-text">Reviews could not be loaded. Check the reviews table and admin RLS policy.</p>}
    <nav className="flex gap-3 mt-7 text-sm"><Link className="text-muted-text hover:text-text" href="/admin/reviews">All</Link><Link className="text-muted-text hover:text-text" href="/admin/reviews?status=pending">Pending</Link><Link className="text-muted-text hover:text-text" href="/admin/reviews?status=approved">Approved</Link></nav>
    <div className="grid gap-4 mt-5">{error?null:reviews?.length?reviews.map(review=><article className="card p-6" key={review.id}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{relationOne(review.products)?.name??'Product no longer available'}</h2><p className="text-sm text-muted-text">{relationOne(review.profiles)?.full_name||'Customer'} · {new Date(review.created_at).toLocaleDateString()}</p></div><p aria-label={`${review.rating} out of 5 stars`}>{review.rating} / 5</p></div>{review.review_text&&<p className="mt-4 whitespace-pre-wrap">{review.review_text}</p>}<ActionForm action={setReviewApprovedAction} submitLabel={review.approved?'Hide review':'Approve review'} className="mt-5"><input type="hidden" name="id" value={review.id}/><input type="hidden" name="approved" value={review.approved?'false':'true'}/></ActionForm></article>):<p className="card p-8 text-center text-muted-text">No reviews found.</p>}</div>
  </>;
}
