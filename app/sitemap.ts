import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://talentia-store-five.vercel.app/en',
      lastModified: new Date(),
      alternates: { languages: {
        en: 'https://talentia-store-five.vercel.app/en',
        ar: 'https://talentia-store-five.vercel.app/ar',
        'x-default': 'https://talentia-store-five.vercel.app/en',
      } },
    },
    {
      url: 'https://talentia-store-five.vercel.app/en/shop',
      lastModified: new Date(),
      alternates: { languages: {
        en: 'https://talentia-store-five.vercel.app/en/shop',
        ar: 'https://talentia-store-five.vercel.app/ar/shop',
        'x-default': 'https://talentia-store-five.vercel.app/en/shop',
      } },
    },
    {
      url: 'https://talentia-store-five.vercel.app/en/product/heartbeat-necklace',
      lastModified: new Date(),
      alternates: { languages: {
        en: 'https://talentia-store-five.vercel.app/en/product/heartbeat-necklace',
        ar: 'https://talentia-store-five.vercel.app/ar/product/heartbeat-necklace',
        'x-default': 'https://talentia-store-five.vercel.app/en/product/heartbeat-necklace',
      } },
    },
  ];
}
