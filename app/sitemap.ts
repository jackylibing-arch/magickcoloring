import type { MetadataRoute } from 'next';
import { POSTS } from '@/lib/posts';
import { COLORING_SLUGS } from '@/lib/coloringSlugs';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/free-tool`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/coloring-pages`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...COLORING_SLUGS.map((s) => ({
      url: `${SITE.url}/coloring-pages/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: s.tier === 1 ? 0.8 : s.tier === 2 ? 0.6 : 0.5,
    })),
    ...POSTS.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
