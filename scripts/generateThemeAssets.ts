// One-shot generator for per-theme book assets.
//
// Pre-generates cover + 20 pages for each theme and stores them in KV
// under `theme-asset:{theme}:cover` and `theme-asset:{theme}:p:{i}`.
// Idempotent — skips anything already cached unless --force.
//
// Usage:
//   npx tsx scripts/generateThemeAssets.ts                 # all missing
//   npx tsx scripts/generateThemeAssets.ts --theme unicorn # single theme
//   npx tsx scripts/generateThemeAssets.ts --force         # regenerate all
//   npx tsx scripts/generateThemeAssets.ts --dry-run
//
// Cost: 5 themes × 21 images × $0.003 = $0.315 max (one-time).

import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { THEMES, type Theme, generateStory, getCoverScene } from '../lib/templates';
import { generateColoringImage, buildBookPagePrompt } from '../lib/falImage';
import {
  getCachedCover,
  getCachedPage,
  setCachedCover,
  setCachedPage,
} from '../lib/themeAssetCache';

const CONCURRENCY = 6;

function parseArgs() {
  const args = process.argv.slice(2);
  const out: { theme?: Theme; force?: boolean; dryRun?: boolean } = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--theme') out.theme = args[++i] as Theme;
    else if (a === '--force') out.force = true;
    else if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

type Slot =
  | { kind: 'cover'; theme: Theme; scene: string }
  | { kind: 'page'; theme: Theme; index: number; scene: string };

async function main() {
  const args = parseArgs();

  if (!process.env.FAL_KEY) {
    console.error('FAL_KEY missing in env.');
    process.exit(1);
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('KV_REST_API_URL / KV_REST_API_TOKEN missing.');
    process.exit(1);
  }

  const themes: Theme[] = args.theme ? [args.theme] : THEMES.map((t) => t.id);

  // Build the full slot list for the requested themes.
  const allSlots: Slot[] = [];
  for (const theme of themes) {
    allSlots.push({
      kind: 'cover',
      theme,
      scene: getCoverScene(theme, 'Child'),
    });
    // Use a neutral placeholder name — it won't appear in prompts anyway,
    // but generateStory requires one to fill the template slots.
    const story = generateStory(theme, 'Child', 6);
    for (let i = 0; i < story.length; i++) {
      allSlots.push({
        kind: 'page',
        theme,
        index: i,
        scene: story[i].scene,
      });
    }
  }

  // Filter out cached slots unless --force.
  let work: Slot[] = allSlots;
  if (!args.force) {
    const filtered: Slot[] = [];
    for (const s of allSlots) {
      const existing =
        s.kind === 'cover'
          ? await getCachedCover(s.theme)
          : await getCachedPage(s.theme, s.index);
      if (!existing) filtered.push(s);
    }
    work = filtered;
  }

  const cost = (work.length * 0.003).toFixed(3);
  console.log(`Themes:          ${themes.join(', ')}`);
  console.log(`Slots to fill:   ${work.length} / ${allSlots.length}`);
  console.log(`Estimated cost:  $${cost}`);

  if (args.dryRun) {
    console.log('\nDry run — exiting.');
    return;
  }
  if (work.length === 0) {
    console.log('Nothing to do. (Use --force to regenerate.)');
    return;
  }

  console.log('\nStarting in 3s… (Ctrl-C to abort)');
  await new Promise((r) => setTimeout(r, 3000));

  let done = 0;
  let failed = 0;

  for (let start = 0; start < work.length; start += CONCURRENCY) {
    const batch = work.slice(start, start + CONCURRENCY);
    await Promise.all(
      batch.map(async (slot) => {
        try {
          const t0 = Date.now();
          const url = await generateColoringImage(buildBookPagePrompt(slot.scene));
          if (slot.kind === 'cover') {
            await setCachedCover(slot.theme, url);
          } else {
            await setCachedPage(slot.theme, slot.index, url);
          }
          const dt = ((Date.now() - t0) / 1000).toFixed(1);
          done++;
          const label =
            slot.kind === 'cover'
              ? `${slot.theme}/cover`
              : `${slot.theme}/p${slot.index}`;
          console.log(`[${done}/${work.length}] ${label}  (${dt}s)`);
        } catch (err: any) {
          failed++;
          const label =
            slot.kind === 'cover'
              ? `${slot.theme}/cover`
              : `${slot.theme}/p${slot.index}`;
          console.error(`[FAIL] ${label}: ${err?.message || err}`);
        }
      })
    );
  }

  console.log(`\nDone. ${done} succeeded, ${failed} failed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
