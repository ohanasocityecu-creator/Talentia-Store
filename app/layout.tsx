import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://talentia-store-five.vercel.app'),
  title: 'TALENTIA | Stainless Steel Accessories in Egypt',
  description: 'Discover TALENTIA\'s collection of elegant stainless-steel accessories designed for everyday wear. Shop necklaces, bracelets, rings and more in Egypt.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'TALENTIA | Stainless Steel Accessories in Egypt',
    description: 'Premium stainless-steel accessories designed for everyday elegance.',
    siteName: 'TALENTIA',
    type: 'website',
    url: 'https://talentia-store-five.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TALENTIA | Stainless Steel Accessories in Egypt',
    description: 'Premium stainless-steel accessories designed for everyday elegance.',
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><Header/>{children}<Footer/></body></html>;
}
