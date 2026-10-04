import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {LanguageProvider} from '@/components/LanguageProvider';
import {getLocale} from '@/lib/locale-server';
import {headers} from 'next/headers';
import {localePath, translate, type Locale} from '@/lib/i18n';

const siteUrl = 'https://talentia-store-five.vercel.app';

export async function generateMetadata() {
  const [locale, requestHeaders] = await Promise.all([getLocale(), headers()]);
  const pathname = requestHeaders.get('x-talentia-pathname') || '/';
  const title = translate(locale, 'seo.title');
  const description = translate(locale, 'seo.description');

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: localePath(pathname, locale),
      languages: {
        en: localePath(pathname, 'en'),
        ar: localePath(pathname, 'ar'),
        'x-default': localePath(pathname, 'en'),
      },
    },
    openGraph: {
      title,
      description,
      siteName: 'TALENTIA',
      type: 'website',
      url: `${siteUrl}${localePath(pathname, locale)}`,
      locale: locale === 'ar' ? 'ar_EG' : 'en_EG',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RootLayout({children}:{children:React.ReactNode}){
  const locale: Locale = await getLocale();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <LanguageProvider locale={locale}>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
