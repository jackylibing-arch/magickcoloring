// Export a Pinterest-ready CSV for the first 30-pin batch.
//
// Pulls pre-generated theme-asset image URLs from Redis (cover + pages 1/5/10/15/19
// for each of the 5 themes), joins them with hand-tuned pin copy, and writes
// pinterest-batch-1.csv ready for manual uploading or the Pinterest bulk-upload tool.
//
// Usage: npx tsx scripts/exportPinterestBatch.ts
//
// Pinterest bulk-upload CSV spec (2026): headers are loose; the important ones
// below are picked up automatically when you paste into Pinterest's batch tool.

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { writeFileSync } from 'node:fs';
import { redis } from '../lib/redis';
import type { Theme } from '../lib/templates';

const SITE = 'https://www.magickcoloring.com';

type PinSpec = {
  theme: Theme;
  pageKey: 'cover' | number; // 0..19
  board: string;
  title: string;
  description: string;
  altText: string;
  destination: string; // relative path
};

// 30 pins = 5 themes × 6 pins (cover + pages 1/5/10/15/19, 0-indexed)
const PIN_PLAN: PinSpec[] = [
  // ─── Princess (6) ──────────────────────────────────────────────
  {
    theme: 'princess',
    pageKey: 'cover',
    board: 'Princess Coloring Pages for Kids',
    title: 'Free Printable Princess Coloring Book for Kids — 20 Pages',
    description:
      "A personalized 20-page princess coloring storybook your little girl will love. Print at home, no waiting. See the free preview — your child becomes the hero of her own magical adventure! #princesscoloring #coloringpages #kidsactivities #printableforkids",
    altText:
      'Black and white princess coloring book cover with castle and tiara, printable for kids',
    destination: '/coloring-pages/princess-coloring-pages',
  },
  {
    theme: 'princess',
    pageKey: 0,
    board: 'Princess Coloring Pages for Kids',
    title: 'Princess Coloring Page — Free Printable for Little Girls',
    description:
      'Beautiful princess coloring page — part of a free 20-page storybook. High-resolution printable PDF, ages 3-8. Tap to see all the pages and print your favorites! #princesscoloring #printablecoloringpages #kidsactivity',
    altText: 'Princess in a flowing gown standing in a garden, line art coloring page for kids',
    destination: '/coloring-pages/princess-coloring-pages',
  },
  {
    theme: 'princess',
    pageKey: 4,
    board: 'Princess Coloring Pages for Kids',
    title: 'Fairy & Princess Coloring Pages — Printable Magic for Kids',
    description:
      'Enchanted fairy-tale coloring page from our princess adventure book. Print free, color together, make memories. 20 unique pages to explore! #fairycoloring #princesscoloring #kidscoloring',
    altText: 'Princess meeting a friendly fairy in an enchanted forest, printable coloring page',
    destination: '/coloring-pages/fairy-coloring-pages',
  },
  {
    theme: 'princess',
    pageKey: 9,
    board: 'Princess Coloring Pages for Kids',
    title: "Your Daughter Becomes the Princess — Personalized Coloring Book",
    description:
      "What if your daughter was the hero of her own princess story? Create a one-of-a-kind 20-page coloring book starring HER name — only $5.90, instant PDF download, no shipping. See her face light up! #personalizedgift #princessbirthday #kidsgiftideas",
    altText:
      'Princess discovering glowing crystal diamonds in a magical cave, line drawing coloring page',
    destination: '/create?theme=princess',
  },
  {
    theme: 'princess',
    pageKey: 14,
    board: 'Princess Coloring Pages for Kids',
    title: 'Princess & Dragon Coloring Page — Free Fairy Tale Printable',
    description:
      'The princess finds a friendly dragon! Part of a free printable coloring book — 20 magical scenes. Great quiet activity for preschoolers and early elementary kids. #dragoncoloring #princesscoloring #printable',
    altText: 'Princess befriending a friendly dragon, coloring page line art for children',
    destination: '/coloring-pages/dragon-coloring-pages',
  },
  {
    theme: 'princess',
    pageKey: 18,
    board: 'Princess Coloring Pages for Kids',
    title: 'Personalized Princess Storybook — Instant PDF, $5.90',
    description:
      "Put your child's NAME in the story. 20 personalized coloring pages, high-res printable PDF delivered in minutes. Unique birthday gift, rainy day activity, screen-free fun. Preview free! #personalizedbook #princessparty #kidsbirthdaygift",
    altText: 'Princess under a starry night sky with her dragon friend, personalized coloring book',
    destination: '/create?theme=princess',
  },

  // ─── Dinosaur (6) ──────────────────────────────────────────────
  {
    theme: 'dinosaur',
    pageKey: 'cover',
    board: 'Dinosaur Coloring Pages',
    title: 'Dinosaur Coloring Book — Free Printable 20-Page Adventure',
    description:
      "Roar! A free 20-page dinosaur coloring storybook for kids. T-rex, triceratops, and more — all printable, all free to preview. Perfect for dino-obsessed preschoolers and kindergarteners! #dinosaurcoloring #dinosaursforkids #printablecoloring #kidsactivities",
    altText: 'Dinosaur coloring book cover with T-rex and jungle background, printable for kids',
    destination: '/coloring-pages/dinosaur-coloring-pages',
  },
  {
    theme: 'dinosaur',
    pageKey: 0,
    board: 'Dinosaur Coloring Pages',
    title: 'T-Rex Coloring Page — Free Printable Dinosaur for Kids',
    description:
      'Friendly T-Rex coloring page from our free 20-page dinosaur adventure book. High-res printable PDF, screen-free activity for ages 3-8. Click through to see all pages! #trex #dinosaurcoloring #printables',
    altText: 'Friendly cartoon T-Rex standing in a jungle, black and white coloring page for kids',
    destination: '/coloring-pages/dinosaur-coloring-pages',
  },
  {
    theme: 'dinosaur',
    pageKey: 4,
    board: 'Dinosaur Coloring Pages',
    title: 'Triceratops Coloring Page — Printable Dinosaur Fun',
    description:
      'Triceratops coloring page — part of a 20-page printable dinosaur storybook, free to preview. Simple bold lines perfect for younger kids. Tap to grab the full book! #triceratops #dinosaurcoloring #kidscoloring',
    altText: 'Triceratops dinosaur with three horns, line art coloring page for children',
    destination: '/coloring-pages/dinosaur-coloring-pages',
  },
  {
    theme: 'dinosaur',
    pageKey: 9,
    board: 'Dinosaur Coloring Pages',
    title: "Personalized Dinosaur Coloring Book — Your Kid's Name in the Story",
    description:
      "Your little dino fan becomes the hero of a 20-page coloring adventure — with HIS name on every page. $5.90, instant PDF, printable at home. Best dinosaur birthday gift ever! #dinosaurparty #personalizedgift #dinosaurbirthday",
    altText: 'Child dinosaur explorer discovering a palm tree jungle, coloring page line art',
    destination: '/create?theme=dinosaur',
  },
  {
    theme: 'dinosaur',
    pageKey: 14,
    board: 'Dinosaur Coloring Pages',
    title: 'Baby Dinosaur Coloring Page — Free Printable for Preschoolers',
    description:
      'Sweet baby dinosaur coloring page from a free 20-page printable storybook. Thick bold lines for little hands. Great for preschool and daycare activities. #babydinosaur #preschoolcoloring #printables',
    altText: 'Adorable baby dinosaur hatching, simple coloring page for preschoolers',
    destination: '/coloring-pages/dinosaur-coloring-pages',
  },
  {
    theme: 'dinosaur',
    pageKey: 18,
    board: 'Dinosaur Coloring Pages',
    title: 'Custom Dinosaur Storybook — Instant PDF Gift for $5.90',
    description:
      "Make your dinosaur-loving kid the star of his own coloring adventure. Type his name, get a 20-page personalized PDF in minutes. Screen-free, printable, unforgettable. Preview free! #dinosaurgift #birthdaygiftforboys #personalizedcoloring",
    altText: 'Dinosaur child and T-Rex best friends under starry sky, personalized book page',
    destination: '/create?theme=dinosaur',
  },

  // ─── Space (6) ─────────────────────────────────────────────────
  {
    theme: 'space',
    pageKey: 'cover',
    board: 'Space & Rocket Coloring Pages',
    title: 'Space Coloring Book — Free 20-Page Printable Adventure',
    description:
      "Blast off! A free 20-page space coloring storybook featuring rockets, planets, and astronauts. Printable PDF, screen-free fun for space-loving kids ages 3-8. #spacecoloring #rocketcoloring #printableforkids #kidsactivities",
    altText: 'Space coloring book cover with rocket, planets, and stars, printable for kids',
    destination: '/coloring-pages/space-coloring-pages',
  },
  {
    theme: 'space',
    pageKey: 0,
    board: 'Space & Rocket Coloring Pages',
    title: 'Astronaut Coloring Page — Free Printable Space Adventure',
    description:
      'Young astronaut looking out to the stars — free printable coloring page from a 20-page storybook. Great quiet-time activity for ages 3-8. Tap for the whole book! #astronaut #spacecoloring #kidsprintables',
    altText: 'Child astronaut looking at stars through a rocket window, coloring page line art',
    destination: '/coloring-pages/space-coloring-pages',
  },
  {
    theme: 'space',
    pageKey: 4,
    board: 'Space & Rocket Coloring Pages',
    title: 'Rocket Ship Coloring Page — Free Printable for Kids',
    description:
      'Rocket ship blasting off! Part of a free 20-page space coloring storybook. High-res printable PDF, perfect for rocket-obsessed preschoolers. #rocket #spacecoloringpages #kidsactivity',
    altText: 'Cartoon rocket ship launching with flames, coloring page line art for children',
    destination: '/coloring-pages/rocket-coloring-pages',
  },
  {
    theme: 'space',
    pageKey: 9,
    board: 'Space & Rocket Coloring Pages',
    title: 'Personalized Space Coloring Book — Your Child as Astronaut',
    description:
      "Imagine your child flying to Mars as the main character! 20-page personalized coloring storybook with their name on every page. $5.90, instant PDF download. Best space-themed gift! #spacegift #astronautparty #personalizedbook",
    altText: 'Child astronaut floating in space near a planet, personalized coloring book page',
    destination: '/create?theme=space',
  },
  {
    theme: 'space',
    pageKey: 14,
    board: 'Space & Rocket Coloring Pages',
    title: 'Planet & Alien Coloring Page — Printable Space Fun',
    description:
      'Meeting a friendly alien on a new planet! Free printable coloring page from our 20-page space adventure. Ages 3-8, bold lines, great for classrooms. #aliencoloring #spacecoloring #printableactivity',
    altText: 'Child astronaut meeting a friendly alien on a colorful planet, coloring page',
    destination: '/coloring-pages/space-coloring-pages',
  },
  {
    theme: 'space',
    pageKey: 18,
    board: 'Space & Rocket Coloring Pages',
    title: 'Custom Astronaut Book — Instant PDF, $5.90',
    description:
      "A personalized space adventure starring YOUR child — 20 unique coloring pages, printable PDF, delivered in minutes. Unique birthday gift, zero shipping wait. Free preview! #personalizedgift #spacebirthday #kidsgift",
    altText: 'Astronaut child pointing at a star constellation on a wall, personalized coloring page',
    destination: '/create?theme=space',
  },

  // ─── Unicorn (6) ───────────────────────────────────────────────
  {
    theme: 'unicorn',
    pageKey: 'cover',
    board: 'Unicorn & Rainbow Coloring Pages',
    title: 'Unicorn Coloring Book — Free 20-Page Printable Magic',
    description:
      "A free 20-page unicorn coloring storybook full of rainbows, sparkles, and magic. Printable PDF, perfect for unicorn-obsessed girls ages 3-8. Tap to grab yours! #unicorncoloring #rainbowcoloring #printableforkids #kidsactivities",
    altText: 'Unicorn coloring book cover with rainbow and stars, printable for little girls',
    destination: '/coloring-pages/unicorn-coloring-pages',
  },
  {
    theme: 'unicorn',
    pageKey: 0,
    board: 'Unicorn & Rainbow Coloring Pages',
    title: 'Cute Unicorn Coloring Page — Free Printable for Girls',
    description:
      'Adorable unicorn with a flowing mane — free printable coloring page from a 20-page storybook. Screen-free activity for ages 3-8. See all pages at the link! #cuteunicorn #unicorncoloring #printable',
    altText: 'Cute cartoon unicorn standing in a meadow, line art coloring page for children',
    destination: '/coloring-pages/unicorn-coloring-pages',
  },
  {
    theme: 'unicorn',
    pageKey: 4,
    board: 'Unicorn & Rainbow Coloring Pages',
    title: 'Rainbow & Unicorn Coloring Page — Printable Kids Activity',
    description:
      'Unicorn under a magical rainbow! Free coloring page from our 20-page unicorn adventure book. Print at home, color together. #rainbowcoloring #unicornprintable #kidscoloring',
    altText: 'Unicorn standing under a rainbow with flowers and butterflies, coloring page',
    destination: '/coloring-pages/rainbow-coloring-pages',
  },
  {
    theme: 'unicorn',
    pageKey: 9,
    board: 'Unicorn & Rainbow Coloring Pages',
    title: "Personalized Unicorn Storybook — Your Daughter's Name in It",
    description:
      "Your little one becomes a unicorn rider in her own 20-page coloring adventure. HER name on every page, high-res printable PDF, $5.90, instant download. Unforgettable gift! #unicornbirthday #personalizedgift #giftforgirls",
    altText: 'Girl riding a unicorn through a magical forest, personalized coloring book page',
    destination: '/create?theme=unicorn',
  },
  {
    theme: 'unicorn',
    pageKey: 14,
    board: 'Unicorn & Rainbow Coloring Pages',
    title: 'Unicorn Castle Coloring Page — Free Printable Magic',
    description:
      'Unicorn magical castle coloring page from a free 20-page storybook. Bold lines for little hands, beautiful details for bigger kids. #unicorncastle #unicorncoloring #printables',
    altText: 'Unicorn in front of a magical fairy-tale castle, line art coloring page',
    destination: '/coloring-pages/unicorn-coloring-pages',
  },
  {
    theme: 'unicorn',
    pageKey: 18,
    board: 'Unicorn & Rainbow Coloring Pages',
    title: 'Custom Unicorn Coloring Book — Instant PDF Gift, $5.90',
    description:
      "Make her the unicorn princess of her own story. Personalized 20-page coloring PDF, her name on every page, delivered in minutes. Perfect unique birthday gift for unicorn-loving girls. #unicornparty #birthdaygiftforgirls #personalizedcoloring",
    altText: 'Unicorn and girl under twinkling star outlines, personalized coloring book page',
    destination: '/create?theme=unicorn',
  },

  // ─── Underwater (6) ────────────────────────────────────────────
  {
    theme: 'underwater',
    pageKey: 'cover',
    board: 'Mermaid & Ocean Coloring Pages',
    title: 'Mermaid Coloring Book — Free 20-Page Underwater Adventure',
    description:
      "Dive into a free 20-page mermaid and ocean coloring storybook! Dolphins, sea turtles, mermaids, and more. Printable PDF, ages 3-8. Free preview at the link! #mermaidcoloring #oceancoloring #printableforkids #kidsactivities",
    altText: 'Mermaid coloring book cover with ocean and sea creatures, printable for kids',
    destination: '/coloring-pages/mermaid-coloring-pages',
  },
  {
    theme: 'underwater',
    pageKey: 0,
    board: 'Mermaid & Ocean Coloring Pages',
    title: 'Ocean Coloring Page — Free Printable Underwater Scene',
    description:
      'Beautiful underwater ocean coloring page from our free 20-page storybook. High-res printable PDF, great for quiet activities and classrooms. #oceancoloring #underwater #kidsprintables',
    altText: 'Underwater ocean scene with fish and seaweed, line art coloring page for kids',
    destination: '/coloring-pages/ocean-coloring-pages',
  },
  {
    theme: 'underwater',
    pageKey: 4,
    board: 'Mermaid & Ocean Coloring Pages',
    title: 'Dolphin Coloring Page — Free Printable for Kids',
    description:
      'Playful dolphin coloring page from a 20-page ocean adventure book. Printable PDF, perfect for sea-loving kids ages 3-8. #dolphincoloring #oceanpages #printable',
    altText: 'Happy dolphin jumping out of the water, simple coloring page for children',
    destination: '/coloring-pages/dolphin-coloring-pages',
  },
  {
    theme: 'underwater',
    pageKey: 9,
    board: 'Mermaid & Ocean Coloring Pages',
    title: "Personalized Mermaid Storybook — Your Child's Ocean Adventure",
    description:
      "Your little one becomes a mermaid exploring the ocean! 20-page personalized coloring PDF with her name. $5.90, instant download, printable at home. Unique birthday gift! #mermaidparty #personalizedgift #giftforgirls",
    altText: 'Mermaid swimming with friendly sea creatures, personalized coloring book page',
    destination: '/create?theme=underwater',
  },
  {
    theme: 'underwater',
    pageKey: 14,
    board: 'Mermaid & Ocean Coloring Pages',
    title: 'Underwater Castle Coloring Page — Free Printable',
    description:
      'Magical underwater castle coloring page — part of a free 20-page ocean storybook. Bold fun lines for little artists. #underwatercastle #mermaidcoloring #printables',
    altText: 'Underwater castle with mermaid and sea creatures, line art coloring page',
    destination: '/coloring-pages/mermaid-coloring-pages',
  },
  {
    theme: 'underwater',
    pageKey: 18,
    board: 'Mermaid & Ocean Coloring Pages',
    title: 'Custom Ocean Adventure Book — Instant PDF, $5.90',
    description:
      "A one-of-a-kind 20-page mermaid coloring book starring YOUR child. High-res PDF delivered in minutes, printable at home, no shipping. Free preview first! #personalizedbook #mermaidbirthday #kidsgift",
    altText: 'Mermaid child reaching toward a sun outline above the waves, personalized coloring page',
    destination: '/create?theme=underwater',
  },
];

function csvEscape(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function resolveImageUrl(theme: Theme, pageKey: 'cover' | number): Promise<string | null> {
  const key =
    pageKey === 'cover' ? `theme-asset:${theme}:cover` : `theme-asset:${theme}:p:${pageKey}`;
  const url = await redis.get<string>(key);
  return url ?? null;
}

async function main() {
  const rows: string[][] = [];
  rows.push([
    'Pin #',
    'Theme',
    'Page',
    'Board',
    'Media URL',
    'Title',
    'Description',
    'Alt text',
    'Destination link',
  ]);

  let missing = 0;
  for (let i = 0; i < PIN_PLAN.length; i++) {
    const p = PIN_PLAN[i];
    const mediaUrl = await resolveImageUrl(p.theme, p.pageKey);
    if (!mediaUrl) {
      console.warn(`⚠️  missing theme-asset for ${p.theme}:${p.pageKey}`);
      missing++;
    }
    rows.push([
      String(i + 1),
      p.theme,
      String(p.pageKey),
      p.board,
      mediaUrl ?? '(MISSING — regenerate)',
      p.title,
      p.description,
      p.altText,
      SITE + p.destination,
    ]);
  }

  const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const outPath = 'pinterest-batch-1.csv';
  writeFileSync(outPath, csv, 'utf8');
  console.log(
    `\n✅ Wrote ${PIN_PLAN.length} pins → ${outPath}` +
      (missing ? `  (${missing} missing images — check theme-asset cache)` : '')
  );
  console.log(
    '\nNext: open the CSV, verify the media URLs render, then either upload each pin manually in Pinterest or import via a bulk-upload tool like Tailwind / Buffer.'
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
