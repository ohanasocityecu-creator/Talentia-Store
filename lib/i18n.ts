import english from '@/messages/en.json';
import arabic from '@/messages/ar.json';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const localeCookieName = 'talentia-locale';

const dictionaries = { en: english, ar: arabic } as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'ar';
}

export function translate(locale: Locale, key: string, values?: Record<string, string | number>): string {
  const lookup = (source: unknown) => key.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[part];
  }, source);
  const value = lookup(dictionaries[locale]) ?? lookup(dictionaries.en);
  if (typeof value !== 'string') return key;
  return values
    ? value.replace(/\{([^}]+)\}/g, (match, name: string) => String(values[name] ?? match))
    : value;
}

export function localizedField(
  record: Record<string, unknown> | null | undefined,
  field: string,
  locale: Locale,
): string | undefined {
  if (!record) return undefined;
  const translations = record.translations ?? record.productTranslations ?? record.product_translations;
  if (translations && typeof translations === 'object' && !Array.isArray(translations)) {
    const localized = (translations as Record<string, unknown>)[locale];
    if (localized && typeof localized === 'object' && !Array.isArray(localized)) {
      const value = (localized as Record<string, unknown>)[field];
      if (typeof value === 'string' && value.trim()) return value;
    }
  }
  const localeField = record[`${field}_${locale}`];
  if (typeof localeField === 'string' && localeField.trim()) return localeField;
  const fallback = record[field];
  return typeof fallback === 'string' && fallback.trim() ? fallback : undefined;
}

export function localizedCategoryName(
  name: string | null | undefined,
  locale: Locale,
  category?: Record<string, unknown> | null,
): string {
  if (!name) return '';
  if (locale === 'en') return name;
  const translations = category?.translations ?? category?.categoryTranslations ?? category?.category_translations;
  if (translations && typeof translations === 'object' && !Array.isArray(translations)) {
    const localized = (translations as Record<string, unknown>)[locale];
    if (localized && typeof localized === 'object' && !Array.isArray(localized)) {
      const localizedName = (localized as Record<string, unknown>).name;
      if (typeof localizedName === 'string' && localizedName.trim()) return localizedName;
    }
  }
  const localeName = category?.name_ar;
  if (typeof localeName === 'string' && localeName.trim()) return localeName;
  const key = name.trim().toLowerCase().replace(/\s+/g, '');
  const translated = translate(locale, `categories.${key}`);
  return translated.startsWith('categories.') ? name : translated;
}

export function formatPrice(value: number, locale: Locale): string {
  const amount = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    maximumFractionDigits: 2,
  }).format(value);
  return `${amount} ${translate(locale, 'money.currency')}`;
}

export function localePath(pathname: string, locale: Locale): string {
  const pathWithoutLocale = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/';
  return `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}
