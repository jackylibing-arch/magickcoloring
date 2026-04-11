// Storage for pre-generated coloring page galleries.
// One KV entry per slug, holding the list of fal.ai image URLs.
// Read by /coloring-pages/[slug] at request time (cached by Next.js).

import { redis } from './redis';
import { COLORING_SLUGS } from './coloringSlugs';

const KV_PREFIX = 'gallery:';

export type Gallery = {
  slug: string;
  topic: string;
  imageUrls: string[]; // length = COLORING_SLUGS[i].prompts.length
  generatedAt: number;
};

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Read is tolerant: if KV isn't configured (e.g. local build without env)
// or the read errors, return null so the page can render a placeholder.
// Only the batch script does writes, and it asserts hard.
//
// At build time Next.js renders all 199 slugs in parallel. A naive
// `redis.get` per slug serializes ~199 round trips to Upstash → 10+ min
// builds. We batch on first call: one `mget` pulls every gallery, later
// getGallery() calls hit the in-memory map.
let bulkPromise: Promise<Map<string, Gallery>> | null = null;

async function loadAllGalleries(): Promise<Map<string, Gallery>> {
  const map = new Map<string, Gallery>();
  if (!kvConfigured()) return map;
  try {
    const keys = COLORING_SLUGS.map((s) => KV_PREFIX + s.slug);
    const values = await redis.mget<Gallery[]>(...keys);
    COLORING_SLUGS.forEach((s, i) => {
      const v = values[i];
      if (v) map.set(s.slug, v);
    });
  } catch (err) {
    console.error('[gallery] bulk read failed', err);
  }
  return map;
}

export async function getGallery(slug: string): Promise<Gallery | null> {
  if (!kvConfigured()) return null;
  if (!bulkPromise) bulkPromise = loadAllGalleries();
  const map = await bulkPromise;
  return map.get(slug) ?? null;
}

export async function saveGallery(g: Gallery): Promise<void> {
  if (!kvConfigured()) {
    throw new Error('KV not configured: KV_REST_API_URL / KV_REST_API_TOKEN missing');
  }
  // No expiry — these are static SEO assets we want to keep forever.
  await redis.set(KV_PREFIX + g.slug, g);
}

export async function listGenerated(): Promise<string[]> {
  if (!kvConfigured()) return [];
  const keys = await redis.keys(KV_PREFIX + '*');
  return keys.map((k: string) => k.replace(KV_PREFIX, ''));
}
