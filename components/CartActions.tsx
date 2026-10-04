'use client';

import {useState} from 'react';
import {ShoppingBag, Heart} from 'lucide-react';
import Link from 'next/link';

export function AddToCart({product, disabled = false}:{product:any; disabled?:boolean}){
  const [added, setAdded] = useState(false);

  function add(){
    const cart = JSON.parse(localStorage.getItem('talentia-cart') || '[]');
    const index = cart.findIndex((item:any) => item.id === product.id);

    if (index >= 0) cart[index].quantity += 1;
    else cart.push({...product, quantity: 1});

    localStorage.setItem('talentia-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('talentia-cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex gap-3 mt-7">
      <button disabled={disabled} onClick={add} className="lux-btn flex-1 disabled:opacity-40" type="button">
        <ShoppingBag size={18} className="mr-2" />
        {added ? 'Added to Your Bag' : 'Add to Bag'}
      </button>
      <button className="ghost-btn" type="button" aria-label={`Add ${product.name} to wishlist`}>
        <Heart />
      </button>
      {added && <Link href="/cart" className="sr-only">Cart</Link>}
    </div>
  );
}

