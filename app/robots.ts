import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account', '/login', '/cart', '/checkout'],
    },
    sitemap: 'https://talentia-store-five.vercel.app/sitemap.xml',
  };
}
