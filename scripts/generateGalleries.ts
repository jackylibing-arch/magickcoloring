// One-shot batch generator for /coloring-pages/[slug] galleries.
//
// Usage:
//   npx tsx scripts/generateGalleries.ts                  # generate all missing
//   npx tsx scripts/generateGalleries.ts --tier 1         # only tier 1
//   npx tsx scripts/generateGalleries.ts --slug unicorn-coloring-pages
//   npx tsx scripts/generateGalleries.ts --limit 5        # cap to 5 (smoke test)
//   npx tsx scripts/generateGalleries.ts --force          # regenerate even if exists
//
// Reads .env.local for FAL_KEY, KV_REST_API_URL, KV_REST_API_TOKEN.
// Writes one Gallery KV entry per slug.
//
// Cost: ~$0.003 per image × 8 images × ~199 slugs = ~$4.78 max.
// Throttled to 6 concurrent requests to stay under fal.ai's limit of 10.

import 'dotenv/config';
// Load .env.local explicitly (Next.js convention; not loaded by dotenv/config).
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { COLORING_SLUGS, type ColoringSlug } from '../lib/coloringSlugs';
import { generateColoringImage, buildBookPagePrompt } from '../lib/falImage';
import { getGallery, saveGallery } from '../lib/galleryStore';

const CONCURRENCY_PER_SLUG = 6; // images in flight for a single slug
const SLUG_CONCURRENCY = 1;     // process N slugs in parallel (keep at 1 to be polite)

function parseArgs() {
  const args = process.argv.slice(2);
  const out: { tier?: number; slug?: string; limit?: number; force?: boolean; dryRun?: boolean } = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--tier') out.tier = Number(args[++i]);
    else if (a === '--slug') out.slug = args[++i];
    else if (a === '--limit') out.limit = Number(args[++i]);
    else if (a === '--force') out.force = true;
    else if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

async function generateForSlug(s: ColoringSlug): Promise<{ slug: string; urls: string[] }> {
  const urls: string[] = new Array(s.prompts.length).fill('');
  const indices = s.prompts.map((_, i) => i);

  for (let start = 0; start < indices.length; start += CONCURRENCY_PER_SLUG) {
    const batch = indices.slice(start, start + CONCURRENCY_PER_SLUG);
    const results = await Promise.all(
      batch.map(async (i) => {
        const fullPrompt = buildBookPagePrompt(s.prompts[i]);
        const url = await generateColoringImage(fullPrompt);
        return { i, url };
      })
    );
    for (const { i, url } of results) urls[i] = url;
  }

  return { slug: s.slug, urls };
}

async function main() {
  const args = parseArgs();

  // Sanity check env
  if (!process.env.FAL_KEY) {
    console.error('FAL_KEY missing in env. Add it to .env.local.');
    process.exit(1);
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV_REST_API_URL / KV_REST_API_TOKEN missing in env. Pull from Vercel or add to .env.local.');
    process.exit(1);
  }

  // Filter the work list
  let work = COLORING_SLUGS.slice();
  if (args.tier !== undefined) work = work.filter((s) => s.tier === args.tier);
  if (args.slug) work = work.filter((s) => s.slug === args.slug);

  // Skip already-generated unless --force
  if (!args.force) {
    const filtered: ColoringSlug[] = [];
    for (const s of work) {
      const existing = await getGallery(s.slug);
      if (existing && existing.imageUrls.length === s.prompts.length) {
        // already done
      } else {
        filtered.push(s);
      }
    }
    work = filtered;
  }

  if (args.limit !== undefined) work = work.slice(0, args.limit);

  const totalImages = work.reduce((acc, s) => acc + s.prompts.length, 0);
  const cost = (totalImages * 0.003).toFixed(2);

  console.log(`Slugs to generate: ${work.length}`);
  console.log(`Total images:      ${totalImages}`);
  console.log(`Estimated cost:    $${cost}`);

  if (args.dryRun) {
    console.log('\nDry run — exiting before any API calls.');
    if (work.length <= 20) {
      console.log('\nSlugs:');
      for (const s of work) console.log('  -', s.slug, `(${s.prompts.length} imgs, tier ${s.tier})`);
    }
    return;
  }

  if (work.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  console.log(`\nStarting in 3s… (Ctrl-C to abort)`);
  await new Promise((r) => setTimeout(r, 3000));

  let done = 0;
  let failed = 0;
  for (const s of work) {
    try {
      const start = Date.now();
      const { urls } = await generateForSlug(s);
      await saveGallery({
        slug: s.slug,
        topic: s.topic,
        imageUrls: urls,
        generatedAt: Date.now(),
      });
      const dt = ((Date.now() - start) / 1000).toFixed(1);
      done++;
      console.log(`[${done}/${work.length}] ${s.slug}  (${dt}s)`);
    } catch (err: any) {
      failed++;
      console.error(`[FAIL] ${s.slug}: ${err?.message || err}`);
    }
  }

  console.log(`\nDone. ${done} succeeded, ${failed} failed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
