'use client';

import Link, { type LinkProps } from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { localePath } from '@/lib/i18n';
import type { ComponentProps } from 'react';

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & Pick<LinkProps, 'href'>;

export function LocalizedLink({href, ...props}:LocalizedLinkProps) {
  const {locale} = useLanguage();
  let localizedHref: LinkProps['href'] = href;

  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
    const parsed = new URL(href, 'https://talentia.invalid');
    localizedHref = `${localePath(parsed.pathname, locale)}${parsed.search}${parsed.hash}`;
  } else if (typeof href !== 'string' && href.pathname?.startsWith('/')) {
    localizedHref = {...href, pathname: localePath(href.pathname, locale)};
  }

  return <Link href={localizedHref} {...props} />;
}
