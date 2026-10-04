import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isLocale, localeCookieName } from '@/lib/i18n';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/.well-known')) {
    return NextResponse.next({ request });
  }
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next({ request });
  }
  if (request.headers.get('x-talentia-locale-rewrite') === '1') {
    return NextResponse.next({ request });
  }

  const localeMatch = pathname.match(/^\/(en|ar)(?=\/|$)/);
  if (!localeMatch) {
    const storedLocale = request.cookies.get(localeCookieName)?.value;
    const locale = isLocale(storedLocale) ? storedLocale : 'en';
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(destination, 307);
  }

  const locale = localeMatch[1] as 'en' | 'ar';
  const localizedPath = pathname.slice(localeMatch[0].length) || '/';
  request.cookies.set(localeCookieName, locale);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-talentia-pathname', localizedPath);
  requestHeaders.set('x-talentia-locale-rewrite', '1');
  const destination = request.nextUrl.clone();
  destination.pathname = localizedPath;
  const response = NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  response.cookies.set(localeCookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!localizedPath.startsWith('/admin') || !url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = { matcher: ['/:path*'] };
