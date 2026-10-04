'use client';

import {LocalizedLink as Link} from '@/components/LocalizedLink';
import {useLanguage} from '@/components/LanguageProvider';
import {localizedCategoryName, localizedField, localePath, type Locale} from '@/lib/i18n';
import {supabase} from '@/lib/supabase';
import {usePathname} from 'next/navigation';
import {useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound, X} from 'lucide-react';

type CategoryLink = {name: string; slug: string; name_ar?: string};
type SearchProduct = {id: string; name: string; slug: string};

function ActionLink({href, label, children, className = ''}:{
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} aria-label={label} title={label} className={`header-action ${className}`}>
      {children}
    </Link>
  );
}

export function Header(){
  const pathname = usePathname() || '/';
  const {locale, setLocale, t} = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [storyActive, setStoryActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryLink[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountMessage, setAccountMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchPending, setSearchPending] = useState(false);
  const [highlightedResult, setHighlightedResult] = useState(-1);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const accountPanelRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const collectionsPanelRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<SearchProduct[]>([]);
  const highlightedResultRef = useRef(-1);
  const localeRef = useRef(locale);
  searchResultsRef.current = searchResults;
  highlightedResultRef.current = highlightedResult;
  localeRef.current = locale;

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setAccountOpen(false);
    setSearchText('');
    setSearchResults([]);
    setSearchMessage('');
    setHighlightedResult(-1);
    setSearchOpen(true);
  }, []);

  useEffect(() => {
    const syncCartCount = () => {
      try {
        const cart: unknown = JSON.parse(localStorage.getItem('talentia-cart') || '[]');
        setCartCount(Array.isArray(cart)
          ? cart.reduce<number>((sum, item) => sum + (Number((item as {quantity?:unknown})?.quantity) || 0), 0)
          : 0);
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
    let active = true;
    void supabase
      .from('categories')
      .select('name,slug')
      .eq('is_active', true)
      .order('sort_order')
      .then(({data, error}) => {
        if (!active) return;
        if (error) {
          console.error('Could not load storefront navigation categories.', error);
          setCategories([]);
          return;
        }
        setCategories(data ?? []);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({data, error}) => {
      if (error) {
        console.error('Could not read the current Supabase session for the account menu.', error);
        setAccountMessage(t('nav.sessionError'));
        return;
      }
      setAccountMessage('');
      setUserEmail(data.session?.user.email ?? null);
    });
    const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, {passive: true});
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const updateStoryState = () => setStoryActive(window.location.hash === '#story');
    updateStoryState();
    window.addEventListener('hashchange', updateStoryState);
    return () => window.removeEventListener('hashchange', updateStoryState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstControl = menuPanelRef.current?.querySelector<HTMLElement>('a, button');
    firstControl?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !menuPanelRef.current) return;
      const focusable = [...menuPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen, closeMobileMenu]);

  useEffect(() => {
    if (!searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    searchInputRef.current?.focus();
    const returnFocus = searchButtonRef.current?.offsetParent
      ? searchButtonRef.current
      : menuButtonRef.current;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        returnFocus?.focus();
      } else if (event.key === 'ArrowDown' && searchResultsRef.current.length) {
        event.preventDefault();
        setHighlightedResult((current) => (current + 1) % searchResultsRef.current.length);
      } else if (event.key === 'ArrowUp' && searchResultsRef.current.length) {
        event.preventDefault();
        setHighlightedResult((current) => (current <= 0 ? searchResultsRef.current.length - 1 : current - 1));
      } else if (event.key === 'Enter' && highlightedResultRef.current >= 0 && searchResultsRef.current[highlightedResultRef.current]) {
        event.preventDefault();
        window.location.assign(localePath(`/product/${searchResultsRef.current[highlightedResultRef.current].slug}`, localeRef.current));
      } else if (event.key === 'Tab' && searchPanelRef.current) {
        const focusable = [...searchPanelRef.current.querySelectorAll<HTMLElement>('input, button, a[href]')]
          .filter((element) => !element.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      returnFocus?.focus();
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountPanelRef.current?.contains(event.target)
        && !accountButtonRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        accountButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!collectionsOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setCollectionsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !collectionsPanelRef.current?.contains(event.target)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [collectionsOpen]);

  async function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchText.trim();
    if (!query) {
      setSearchResults([]);
      setSearchMessage('');
      return;
    }
    const safeQuery = query.replace(/[%_,]/g, '').trim();
    if (!safeQuery) {
      setSearchResults([]);
      setSearchMessage(t('nav.searchNoResults'));
      return;
    }
    if (!supabase) {
      setSearchResults([]);
      setSearchMessage(t('nav.searchSetup'));
      return;
    }
    setSearchPending(true);
    setSearchMessage('');
    setHighlightedResult(-1);
    try {
      const {data, error} = await supabase
        .from('products')
        .select('id,name,slug')
        .eq('is_active', true)
        .ilike('name', `%${safeQuery}%`)
        .order('name')
        .limit(6);
      if (error) {
        console.error('Product search failed.', error);
        setSearchResults([]);
        setSearchMessage(t('nav.searchUnavailable'));
        return;
      }
      const results = data ?? [];
      setSearchResults(results);
      setSearchMessage(results.length ? '' : t('nav.searchNoResults'));
    } catch (error) {
      console.error('Product search failed.', error);
      setSearchResults([]);
      setSearchMessage(t('nav.searchUnavailable'));
    } finally {
      setSearchPending(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error('Could not sign out of the storefront account.', error);
      setAccountMessage(t('nav.signOutError'));
      return;
    }
    setAccountMessage('');
    setAccountOpen(false);
  }

  const isShopActive = pathname.endsWith('/shop') || pathname.includes('/category/');
  const isAboutActive = storyActive;
  const collectionsDropdown = categories.length > 1;
  const collectionLabel = t('nav.collections');

  return (
    <>
      <div className="bg-soft-pink text-burgundy text-center px-3 py-2 text-[10px] font-semibold tracking-[0.14em] uppercase sm:tracking-[0.18em]">
        {t('brand.tagline')}
      </div>

      <header className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
        scrolled ? 'border-border bg-cream/95 backdrop-blur-md' : 'border-transparent bg-cream'
      }`}>
        <div className="container flex h-[72px] items-center justify-between gap-3 sm:h-20 sm:gap-5">
          <button
            ref={menuButtonRef}
            className="header-mobile-menu text-burgundy md:hidden"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.menuOpen')}
            aria-expanded={menuOpen}
            aria-controls="talentia-mobile-menu"
          >
            <Menu size={21} strokeWidth={1.7} />
          </button>

          <Link href="/" className="header-wordmark serif text-[21px] tracking-[0.19em] text-text sm:text-2xl md:text-[27px]" aria-label={`TALENTIA — ${t('nav.home')}`}>
            TALENTIA
          </Link>

          <nav className="hidden items-center gap-5 text-[13px] font-medium md:flex lg:gap-7 xl:gap-9" aria-label={t('nav.categories')}>
            <Link
              href="/shop"
              aria-current={isShopActive ? 'page' : undefined}
              className={`header-nav-link ${isShopActive ? 'is-active' : ''}`}
            >
              {t('nav.shop')}
            </Link>

            {collectionsDropdown ? (
              <div ref={collectionsPanelRef} className="relative">
                <button
                  type="button"
                  className="header-nav-link inline-flex items-center gap-1.5"
                  aria-haspopup="true"
                  aria-expanded={collectionsOpen}
                  aria-label={t('nav.collectionOpen')}
                  onClick={() => setCollectionsOpen((value) => !value)}
                >
                  {collectionLabel}
                  <ChevronDown size={14} className={`header-chevron ${collectionsOpen ? 'is-open' : ''}`} />
                </button>
                {collectionsOpen && (
                  <div className="header-dropdown" aria-label={t('nav.collectionMenu')}>
                    <p className="header-dropdown-eyebrow">{t('nav.collectionMenu')}</p>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={() => setCollectionsOpen(false)}
                        className="header-dropdown-link"
                      >
                        {localizedCategoryName(category.name, locale, category)}
                      </Link>
                    ))}
                    <Link href="/shop" onClick={() => setCollectionsOpen(false)} className="header-dropdown-all">
                      {t('nav.allAccessories')}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/shop" className="header-nav-link">{collectionLabel}</Link>
            )}

            <Link
              href="/#story"
              aria-current={isAboutActive ? 'location' : undefined}
              className={`header-nav-link ${isAboutActive ? 'is-active' : ''}`}
            >
              {t('nav.about')}
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-burgundy sm:gap-4 lg:gap-5">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={openSearch}
              aria-label={t('nav.openSearch')}
              className="header-icon-button hidden sm:inline-flex"
            >
              <Search size={19} strokeWidth={1.65} />
              <span className="hidden xl:inline">{t('nav.search')}</span>
            </button>

            <ActionLink href="/wishlist" label={t('nav.wishlistOpen')} className="header-icon-button">
              <Heart size={19} strokeWidth={1.65} />
              <span className="hidden xl:inline">{t('nav.wishlist')}</span>
            </ActionLink>

            <ActionLink href="/cart" label={t('nav.bagOpen')} className="header-icon-button">
              <ShoppingBag size={19} strokeWidth={1.65} />
              <span className="hidden sm:inline">{t('nav.bag')}</span>
              {cartCount > 0 && (
                <span className="header-count" aria-label={`${cartCount} ${t('nav.bag')}`}>
                  {cartCount}
                </span>
              )}
            </ActionLink>

            <div className="relative hidden lg:block">
              <button
                ref={accountButtonRef}
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-label={t('nav.account')}
                aria-haspopup="true"
                aria-expanded={accountOpen}
                className="header-icon-button"
              >
                <UserRound size={18} strokeWidth={1.65} />
                <span>{t('nav.account')}</span>
              </button>
              {accountOpen && (
                <div ref={accountPanelRef} className="header-dropdown header-account-menu" aria-label={t('nav.accountMenu')}>
                  {accountMessage && <p role="alert" className="mb-2 text-xs text-burgundy">{accountMessage}</p>}
                  {userEmail ? (
                    <>
                      <p className="header-dropdown-eyebrow truncate">{userEmail}</p>
                      <Link href="/account" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.myAccount')}</Link>
                      <Link href="/account/orders" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.orders')}</Link>
                      <Link href="/wishlist" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.wishlist')}</Link>
                      <button type="button" onClick={() => void signOut()} className="header-dropdown-link header-dropdown-button">{t('nav.logout')}</button>
                    </>
                  ) : (
                    <>
                      <Link href="/account" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.myAccount')}</Link>
                      <Link href="/login" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.login')}</Link>
                      <Link href="/signup" onClick={() => setAccountOpen(false)} className="header-dropdown-link">{t('nav.createAccount')}</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              aria-label={locale === 'en' ? t('brand.switchToArabic') : t('brand.switchToEnglish')}
              className="header-language hidden md:inline-flex"
            >
              {locale.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <button
            type="button"
            aria-label={t('nav.menuClose')}
            className="absolute inset-0 h-full w-full bg-text/25"
            onClick={closeMobileMenu}
          />
          <nav
            ref={menuPanelRef}
            id="talentia-mobile-menu"
            className="header-mobile-drawer absolute inset-y-0 start-0 flex w-[min(88vw,390px)] flex-col overflow-y-auto bg-cream px-6 pb-8 pt-5 shadow-xl"
            aria-label={t('nav.mobileNavigation')}
            aria-modal="true"
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-border pb-5">
              <span className="serif text-xl tracking-[0.18em] text-text">TALENTIA</span>
              <button type="button" onClick={closeMobileMenu} aria-label={t('nav.menuClose')} className="header-icon-button">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 py-7">
              <p className="header-dropdown-eyebrow">{t('nav.categories')}</p>
              <Link href="/shop" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.shop')}</Link>
              <p className="header-dropdown-eyebrow pt-1">{collectionLabel}</p>
              {categories.length > 1 ? categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`} onClick={closeMobileMenu} className="header-mobile-link">
                  {localizedCategoryName(category.name, locale, category)}
                </Link>
              )) : (
                <Link href="/shop" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.allAccessories')}</Link>
              )}
              <Link href="/#story" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.about')}</Link>
            </div>

            <div className="rose-line" />

            <div className="grid gap-5 py-7">
              <button type="button" onClick={openSearch} className="header-mobile-link inline-flex items-center gap-3 text-start">
                <Search size={18} strokeWidth={1.7} /> {t('nav.search')}
              </button>
              <Link href="/wishlist" onClick={closeMobileMenu} className="header-mobile-link inline-flex items-center gap-3">
                <Heart size={18} strokeWidth={1.7} /> {t('nav.wishlist')}
              </Link>
              <Link href="/cart" onClick={closeMobileMenu} className="header-mobile-link inline-flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.7} /> {t('nav.bag')} {cartCount > 0 ? `(${cartCount})` : ''}
              </Link>
              <Link href="/account" onClick={closeMobileMenu} className="header-mobile-link inline-flex items-center gap-3">
                <UserRound size={18} strokeWidth={1.7} /> {t('nav.account')}
              </Link>
              <Link href="/track-order" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.trackOrder')}</Link>
              {userEmail ? (
                <>
                  <Link href="/account/orders" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.orders')}</Link>
                  <button type="button" onClick={() => { closeMobileMenu(); void signOut(); }} className="header-mobile-link text-start">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.login')}</Link>
                  <Link href="/signup" onClick={closeMobileMenu} className="header-mobile-link">{t('nav.createAccount')}</Link>
                </>
              )}
            </div>

            <div className="mt-auto border-t border-border pt-5">
              <p className="header-dropdown-eyebrow mb-3">{t('nav.language')}</p>
              <div className="flex items-center gap-2" role="group" aria-label={t('nav.chooseLanguage')}>
                {(['en', 'ar'] as Locale[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={locale === option}
                    onClick={() => {
                      closeMobileMenu();
                      setLocale(option);
                    }}
                    className={`header-language ${locale === option ? 'is-selected' : ''}`}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-text/35 px-4 pt-[max(8vh,32px)]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 h-full w-full"
            aria-label={t('nav.closeSearch')}
            onClick={() => setSearchOpen(false)}
          />
          <div ref={searchPanelRef} className="header-search-panel relative mx-auto w-full max-w-2xl bg-cream p-5 shadow-xl sm:p-8" role="dialog" aria-modal="true" aria-label={t('nav.openSearch')}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="serif text-2xl text-text">{t('nav.search')}</h2>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label={t('nav.closeSearch')} className="header-icon-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitSearch} role="search">
              <label htmlFor="talentia-site-search" className="sr-only">{t('nav.searchPlaceholder')}</label>
              <div className="flex gap-2">
                <input
                  ref={searchInputRef}
                  id="talentia-site-search"
                  className="input"
                  type="search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="talentia-search-results"
                  aria-expanded={searchResults.length > 0}
                  aria-activedescendant={highlightedResult >= 0 ? `talentia-search-result-${highlightedResult}` : undefined}
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  autoComplete="off"
                />
                <button type="submit" className="lux-btn !w-auto shrink-0 !px-5" disabled={searchPending}>
                  <Search size={17} className="me-2" />{t('nav.searchSubmit')}
                </button>
              </div>
            </form>
            {searchPending && <p className="mt-5 text-sm text-muted-text" role="status">{t('nav.searchLoading')}</p>}
            {searchMessage && !searchPending && <p className="mt-5 text-sm text-muted-text" role="status">{searchMessage}</p>}
            {searchResults.length > 0 && (
              <ul id="talentia-search-results" className="mt-5 border-t border-border pt-2" role="listbox" aria-label={t('nav.search')}>
                {searchResults.map((product, index) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      id={`talentia-search-result-${index}`}
                      role="option"
                      aria-selected={highlightedResult === index}
                      onClick={() => setSearchOpen(false)}
                      className={`block border-b border-border py-3 text-sm text-text hover:text-deep-rose ${
                        highlightedResult === index ? 'text-deep-rose' : ''
                      }`}
                    >
                      {localizedField(product, 'name', locale) ?? product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-muted-text">↑ ↓ {t('nav.keyboardNavigate')} · Enter {t('nav.keyboardSelect')} · Esc {t('nav.keyboardClose')}</p>
          </div>
        </div>
      )}
    </>
  );
}
