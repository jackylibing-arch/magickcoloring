// Shared, per-theme image cache.
//
// Because our story templates (lib/templates.ts) use the child's name ONLY
// in the text and NOT in the fal.ai image prompts, the 21 images per theme
// (1 cover + 20 pages) are identical across all users who pick the same theme.
//
// So we pre-generate each theme's images once, stash them in KV, and every
// subsequent book creation reads from cache — zero fal.ai cost per sale.
//
// KV layout:
//   theme-asset:{theme}:cover  -> string (fal.ai URL)
//   theme-asset:{theme}:p:{i}  -> string (fal.ai URL, i = 0..19)
//
// Reads are tolerant (fall through to live generation on miss).
// Writes are only done by the batch script + a one-shot cache-fill in
// bookPreviewGen (so the first-ever book for a theme still populates
// the cache, even if we forgot to run the batch).

import { redis } from './redis';
import type { Theme } from './templates';

const PREFIX = 'theme-asset:';

function coverKey(theme: Theme): string {
  return `${PREFIX}${theme}:cover`;
}

function pageKey(theme: Theme, pageIndex: number): string {
  return `${PREFIX}${theme}:p:${pageIndex}`;
}

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCachedCover(theme: Theme): Promise<string | null> {
  if (!kvConfigured()) return null;
  try {
    return (await redis.get<string>(coverKey(theme))) ?? null;
  } catch (err) {
    console.error('[themeAssetCache] getCachedCover failed', theme, err);
    return null;
  }
}

export async function getCachedPage(theme: Theme, i: number): Promise<string | null> {
  if (!kvConfigured()) return null;
  try {
    return (await redis.get<string>(pageKey(theme, i))) ?? null;
  } catch (err) {
    console.error('[themeAssetCache] getCachedPage failed', theme, i, err);
    return null;
  }
}

export async function setCachedCover(theme: Theme, url: string): Promise<void> {
  if (!kvConfigured()) return;
  // No TTL — these are permanent assets.
  await redis.set(coverKey(theme), url);
}

export async function setCachedPage(theme: Theme, i: number, url: string): Promise<void> {
  if (!kvConfigured()) return;
  await redis.set(pageKey(theme, i), url);
}
