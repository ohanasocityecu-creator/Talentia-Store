'use client';
import Link from 'next/link';
import {Search,Heart,ShoppingBag,Menu,X} from 'lucide-react';
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';

type CategoryLink={name:string;slug:string};

export function Header(){
	const [open,setOpen]=useState(false);
	const [categories,setCategories]=useState<CategoryLink[]>([]);
	useEffect(()=>{
		if(!supabase)return;
		void supabase.from('categories').select('name,slug').eq('is_active',true).order('sort_order').then(({data})=>setCategories(data??[]));
	},[]);
	return <><div className="bg-soft-pink text-burgundy text-center py-2 text-xs tracking-[.2em]">TALENTIA</div><header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border"><div className="container h-20 flex items-center justify-between"><button className="md:hidden text-burgundy" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'}>{open?<X/>:<Menu/>}</button><Link href="/" className="serif text-3xl tracking-[.16em]">TALENTIA</Link><nav className="hidden md:flex gap-8 text-sm"><Link className="hover:text-deep-rose" href="/shop">Shop</Link>{categories.map(category=><Link className="hover:text-deep-rose" key={category.slug} href={`/category/${category.slug}`}>{category.name}</Link>)}</nav><div className="flex gap-4 text-burgundy"><Link className="hover:text-deep-rose" href="/shop" aria-label="Search"><Search size={19}/></Link><Link className="hover:text-deep-rose" href="/wishlist" aria-label="Wishlist"><Heart size={19}/></Link><Link className="hover:text-deep-rose" href="/cart" aria-label="Cart"><ShoppingBag size={19}/></Link></div></div>{open&&<nav className="md:hidden border-t border-border px-5 py-5 grid gap-4 bg-white"><Link className="hover:text-deep-rose" href="/shop" onClick={()=>setOpen(false)}>Shop All</Link>{categories.map(category=><Link className="hover:text-deep-rose" key={category.slug} href={`/category/${category.slug}`} onClick={()=>setOpen(false)}>{category.name}</Link>)}</nav>}</header></>;
}
