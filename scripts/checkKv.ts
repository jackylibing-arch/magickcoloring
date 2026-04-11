// Quick KV inspector: lists keys by prefix and samples a few galleries.
// Usage: npx tsx scripts/checkKv.ts

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { redis } from '../lib/redis';

async function main() {
  const gallery = await redis.keys('gallery:*');
  const themeAsset = await redis.keys('theme-asset:*');
  const books = await redis.keys('book:*');
  console.log('gallery:*      ', gallery.length);
  console.log('theme-asset:*  ', themeAsset.length);
  console.log('book:*         ', books.length);

  const samples = gallery.length ? [gallery[0], gallery[Math.floor(gallery.length / 2)], gallery[gallery.length - 1]] : [];
  for (const key of samples) {
    const g = (await redis.get(key)) as any;
    const url = g?.imageUrls?.[0];
    if (!url) { console.log(key, '— no URL'); continue; }
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(key.replace('gallery:', ''), '—', res.status, res.ok ? 'OK' : 'DEAD');
    } catch (e: any) {
      console.log(key.replace('gallery:', ''), '— fetch error:', e.message);
    }
  }
}
main().catch(console.error);
