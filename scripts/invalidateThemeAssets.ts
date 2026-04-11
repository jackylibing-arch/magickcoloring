// Invalidate specific theme-asset cache entries after template edits.
// Deletes the cached fal.ai URL so the next run of generateThemeAssets
// regenerates the image using the current scene prompt.
//
// Usage:
//   npx tsx scripts/invalidateThemeAssets.ts        # delete the hard-coded list
//   npx tsx scripts/invalidateThemeAssets.ts --all  # wipe the entire theme-asset cache

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { redis } from '../lib/redis';
import type { Theme } from '../lib/templates';

// Scenes edited this session (and in the previous session before compaction)
// that need fresh generation. Each entry = (theme, pageIndex | 'cover').
// Page indices are 0-based (page 1 = index 0).
const STALE: Array<{ theme: Theme; index: number | 'cover' }> = [
  // --- this session ---
  // Dinosaur p12 (cave entrance → open space)
  { theme: 'dinosaur', index: 11 },
  // Dinosaur p19 (pinky promise → clearly separated)
  { theme: 'dinosaur', index: 18 },
  // Space p1 (window sill night sky → interior view)
  { theme: 'space', index: 0 },
  // Space p20 (window bright star → pointing at wall outline)
  { theme: 'space', index: 19 },
  // Unicorn p20 (starry sky → star outlines in corner)
  { theme: 'unicorn', index: 19 },
  // Underwater p5 (diving into ocean water → standing at edge)
  { theme: 'underwater', index: 4 },
  // Underwater p7 (coral reef → white background)
  { theme: 'underwater', index: 6 },
  // Underwater p8 (under water shark → separated, white bg)
  { theme: 'underwater', index: 7 },
  // Underwater p10 (underwater cave entrance → open interior)
  { theme: 'underwater', index: 9 },
  // Underwater p14 (underwater castle → outlines, white bg)
  { theme: 'underwater', index: 13 },
  // Underwater p19 (surface of water → sun outline, white bg)
  { theme: 'underwater', index: 18 },
  // --- previous session (edits that were committed to templates.ts
  // before context ran out; safer to rebuild even if some were already
  // regenerated) ---
  // Princess p10 (glowing crystals cave — now diamond crystals w/ white bg)
  { theme: 'princess', index: 9 },
  // Princess p12 (shadow thief's lair — cave entrance)
  { theme: 'princess', index: 11 },
  // Princess p14 (crystal high against shadows)
  { theme: 'princess', index: 13 },
  // Princess p19 (dragon best friend — separated)
  { theme: 'princess', index: 18 },
  // Princess p20 (watching stars — star outlines)
  { theme: 'princess', index: 19 },
  // Dinosaur p8 (huge shadow — child looking up)
  { theme: 'dinosaur', index: 7 },
  // Dinosaur p13 (peeking eyes in cave)
  { theme: 'dinosaur', index: 12 },
];

function keyFor(theme: Theme, index: number | 'cover'): string {
  return index === 'cover' ? `theme-asset:${theme}:cover` : `theme-asset:${theme}:p:${index}`;
}

async function main() {
  const all = process.argv.includes('--all');
  if (all) {
    const keys = await redis.keys('theme-asset:*');
    if (keys.length === 0) {
      console.log('No theme-asset keys found.');
      return;
    }
    console.log(`Deleting ${keys.length} keys…`);
    for (const k of keys) await redis.del(k);
    console.log('Done.');
    return;
  }

  const keys = STALE.map(({ theme, index }) => keyFor(theme, index));
  console.log(`Deleting ${keys.length} stale theme-asset keys:`);
  for (const k of keys) console.log('  -', k);

  let deleted = 0;
  let missing = 0;
  for (const k of keys) {
    const existed = await redis.del(k);
    if (existed) deleted++;
    else missing++;
  }
  console.log(`\nDeleted: ${deleted} · already missing: ${missing}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
