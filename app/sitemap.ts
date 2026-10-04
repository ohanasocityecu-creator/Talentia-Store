import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://talentia-store-five.vercel.app/', lastModified: new Date() },
    { url: 'https://talentia-store-five.vercel.app/shop', lastModified: new Date() },
    { url: 'https://talentia-store-five.vercel.app/product/heartbeat-necklace', lastModified: new Date() },
  ];
}
