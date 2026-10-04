import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/en/admin', '/ar/admin',
        '/en/account', '/ar/account',
        '/en/login', '/ar/login',
        '/en/cart', '/ar/cart',
        '/en/checkout', '/ar/checkout',
      ],
    },
    sitemap: 'https://talentia-store-five.vercel.app/sitemap.xml',
  };
}
