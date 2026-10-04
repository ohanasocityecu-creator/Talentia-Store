'use client';
import Link from 'next/link';
import {Search, Heart, ShoppingBag, Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useLanguage} from '@/components/LanguageProvider';
import {localizedCategoryName} from '@/lib/i18n';

type CategoryLink = { name: string; slug: string };

export function Header(){
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryLink[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const {locale, setLocale, t} = useLanguage();

  useEffect(() => {
    const syncCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('talentia-cart') || '[]');
        setCartCount(cart.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0));
      } catch {
        setCartCount(0);
      }
    };

    syncCartCount();
    window.addEventListener('storage', syncCartCount);
    window.addEventListener('talentia-cart-updated', syncCartCount);
    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('talentia-cart-updated', syncCartCount);
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase
      .from('categories')
      .select('name,slug')
      .eq('is_active', true)
      .order('sort_order')
      .then(({data}) => setCategories(data ?? []));
  }, []);

  const navLinks = [
    {label: t('nav.shop'), href: '/shop'},
    ...(categories.length ? categories.map((category) => ({ label: localizedCategoryName(category.name, locale), href: `/category/${category.slug}` })) : []),
    {label: t('nav.about'), href: '/#story'},
  ];

  return (
    <>
      <div className="bg-soft-pink text-burgundy text-center py-2 text-[10px] font-semibold tracking-[0.18em] uppercase">
        {t('brand.tagline')}
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-cream/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between gap-4">
          <button className="md:hidden text-burgundy" onClick={() => setOpen((value) => !value)} aria-label={open ? t('nav.menuClose') : t('nav.menuOpen')}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="serif text-2xl tracking-[0.2em] text-text md:text-3xl" aria-label={`TALENTIA — ${t('nav.home')}`}>
            TALENTIA
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-text hover:text-deep-rose">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-burgundy md:gap-4">
            <Link href="/shop" aria-label={t('nav.search')} className="hover:text-deep-rose">
              <Search size={18} />
            </Link>
            <Link href="/wishlist" aria-label={t('nav.wishlist')} className="hover:text-deep-rose">
              <Heart size={18} />
            </Link>
            <Link href="/cart" aria-label={t('nav.cart')} className="relative inline-flex items-center gap-2 hover:text-deep-rose">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-burgundy px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/account" aria-label={t('nav.account')} className="hidden text-xs font-semibold md:inline">
              {t('nav.account')}
            </Link>
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              aria-label={locale === 'en' ? t('brand.switchToArabic') : t('brand.switchToEnglish')}
              className="min-w-8 border-s border-border ps-3 text-xs font-bold tracking-widest text-burgundy hover:text-deep-rose focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-rose"
            >
              {locale.toUpperCase()}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-white px-5 py-5 md:hidden" aria-label="Mobile navigation">
            <div className="grid gap-4 text-sm font-medium">
              <Link href="/shop" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.shop').toUpperCase()}</Link>
              {categories.length > 0 && categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">
                  {localizedCategoryName(category.name, locale)}
                </Link>
              ))}
              <Link href="/#story" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.about')}</Link>
              <Link href="/track-order" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.trackOrder')}</Link>
              <Link href="/account" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.account')}</Link>
              <Link href="/login" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.login')}</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="text-text hover:text-deep-rose">{t('nav.register')}</Link>
              <button
                type="button"
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                aria-label={locale === 'en' ? t('brand.switchToArabic') : t('brand.switchToEnglish')}
                className="w-fit border-t border-border pt-4 text-start text-sm font-bold tracking-widest text-burgundy hover:text-deep-rose"
              >
                {locale.toUpperCase()}
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
