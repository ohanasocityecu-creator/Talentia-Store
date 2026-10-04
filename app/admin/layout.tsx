import Link from 'next/link';
import {requireAdmin} from '@/lib/admin-auth';
import {signOut} from './actions';

export default async function AdminLayout({children}:{children:React.ReactNode}){
	const {profile}=await requireAdmin();
	return <div className="min-h-screen bg-white"><aside className="fixed left-0 top-0 bottom-0 w-64 bg-cream text-text p-7 hidden lg:flex lg:flex-col"><Link href="/" className="serif text-2xl tracking-widest">TALENTIA</Link><p className="text-xs text-muted-text mt-2">ADMIN</p><nav className="grid gap-2 mt-12 text-sm">{[['/admin','Overview'],['/admin/products','Products'],['/admin/categories','Categories'],['/admin/orders','Orders'],['/admin/customers','Customers'],['/admin/pricing','Pricing'],['/admin/shipping','Shipping'],['/admin/reviews','Reviews'],['/admin/content','Content']].map(([url,label])=><Link className="p-3 rounded hover:bg-blush" href={url} key={url}>{label}</Link>)}</nav><div className="mt-auto"><p className="text-sm text-muted-text">{profile.full_name||'Administrator'}</p><form action={signOut}><button className="text-sm text-muted-text hover:text-text mt-3">Sign out</button></form></div></aside><main className="lg:ml-64 p-6 md:p-10">{children}</main></div>;
}
