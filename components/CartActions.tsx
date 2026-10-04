'use client';

import {useState} from 'react';
import {ShoppingBag, Heart} from 'lucide-react';
import {LocalizedLink as Link} from '@/components/LocalizedLink';
import {useLanguage} from '@/components/LanguageProvider';

export function AddToCart({product, disabled = false}:{product:any; disabled?:boolean}){
  const [added, setAdded] = useState(false);
  const {t} = useLanguage();

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
        <ShoppingBag size={18} className="me-2" />
        {added ? t('product.addedToBag') : t('product.addToBag')}
      </button>
      <button className="ghost-btn" type="button" aria-label={t('product.addWishlist', {name: product.name})}>
        <Heart />
      </button>
      {added && <Link href="/cart" className="sr-only">{t('nav.cart')}</Link>}
    </div>
  );
}
