// Storage for pre-generated coloring page galleries.
// One KV entry per slug, holding the list of fal.ai image URLs.
// Read by /coloring-pages/[slug] at request time (cached by Next.js).

import { kv } from '@vercel/kv';

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
export async function getGallery(slug: string): Promise<Gallery | null> {
  if (!kvConfigured()) return null;
  try {
    return (await kv.get<Gallery>(KV_PREFIX + slug)) ?? null;
  } catch (err) {
    console.error('[gallery] read failed', slug, err);
    return null;
  }
}

export async function saveGallery(g: Gallery): Promise<void> {
  if (!kvConfigured()) {
    throw new Error('KV not configured: KV_REST_API_URL / KV_REST_API_TOKEN missing');
  }
  // No expiry — these are static SEO assets we want to keep forever.
  await kv.set(KV_PREFIX + g.slug, g);
}

export async function listGenerated(): Promise<string[]> {
  if (!kvConfigured()) return [];
  const keys = await kv.keys(KV_PREFIX + '*');
  return keys.map((k) => k.replace(KV_PREFIX, ''));
}
