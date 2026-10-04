'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { localePath, translate, type Locale } from '@/lib/i18n';

type LanguageContextValue = {
  locale: Locale;
  t: (key: string, values?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname() || '/';
  const setLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const destination = `${localePath(pathname, nextLocale)}${window.location.search}${window.location.hash}`;
    window.location.assign(destination);
  }, [locale, pathname]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    t: (key, values) => translate(locale, key, values),
    setLocale,
  }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider.');
  return context;
}
