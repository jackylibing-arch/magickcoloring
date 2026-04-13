// Storage for pre-generated coloring page galleries.
// One KV entry per slug, holding the list of fal.ai image URLs.
// Read by /coloring-pages/[slug] at request time (cached by Next.js).

import { unstable_cache } from 'next/cache';
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
let bulkPromise: Promise<Record<string, Gallery>> | null = null;

async function loadAllGalleriesRaw(): Promise<Record<string, Gallery>> {
  const out: Record<string, Gallery> = {};
  if (!kvConfigured()) {
    console.warn('[gallery] KV not configured at build/runtime');
    return out;
  }
  const CHUNK = 50;
  for (let i = 0; i < COLORING_SLUGS.length; i += CHUNK) {
    const slice = COLORING_SLUGS.slice(i, i + CHUNK);
    const keys = slice.map((s) => KV_PREFIX + s.slug);
    const values = (await redis.mget<(Gallery | null)[]>(...keys)) as (
      | Gallery
      | null
    )[];
    slice.forEach((s, j) => {
      const v = values[j];
      if (v) out[s.slug] = v;
    });
  }
  console.log(
    `[gallery] loaded ${Object.keys(out).length}/${COLORING_SLUGS.length} galleries`
  );
  return out;
}

// `unstable_cache` lets us call Upstash (which uses no-store fetch internally)
// during static generation. Without this wrapper Next.js throws "Dynamic
// server usage: no-store fetch" and the page falls back to an empty render.
const loadAllGalleriesCached = unstable_cache(
  loadAllGalleriesRaw,
  ['all-galleries'],
  { revalidate: 3600, tags: ['galleries'] }
);

export async function getGallery(slug: string): Promise<Gallery | null> {
  if (!kvConfigured()) return null;
  if (!bulkPromise) bulkPromise = loadAllGalleriesCached();
  const all = await bulkPromise;
  return all[slug] ?? null;
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
