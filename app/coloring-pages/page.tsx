// /coloring-pages — index of all programmatic SEO galleries.
// Lightweight directory: groups by tier 1 (primary topics) for the main browse,
// then lists tier 2 and tier 3 separately for internal linking SEO.

import type { Metadata } from 'next';
import Link from 'next/link';
import { COLORING_SLUGS } from '@/lib/coloringSlugs';

export const metadata: Metadata = {
  title: 'Free Printable Coloring Pages — Magick Coloring',
  description:
    'Browse hundreds of free printable coloring pages: unicorns, dinosaurs, princesses, animals, holidays and more. Instant download, no signup needed.',
  alternates: { canonical: '/coloring-pages' },
};

export default function ColoringPagesIndex() {
  const tier1 = COLORING_SLUGS.filter((s) => s.tier === 1);
  const tier2 = COLORING_SLUGS.filter((s) => s.tier === 2);
  const tier3 = COLORING_SLUGS.filter((s) => s.tier === 3);

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-2 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Free Printable <span className="text-brand-600">Coloring Pages</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Hundreds of high-quality coloring pages, organized by topic.
          Free download · No signup · Print at home.
        </p>
        <div className="mt-5">
          <Link href="/" className="btn-primary inline-block">
            🎨 Or make a personalized storybook →
          </Link>
        </div>
      </section>

      {/* Tier 1 — primary topics, big tiles */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Browse by topic
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tier1.map((s) => (
            <Link
              key={s.slug}
              href={`/coloring-pages/${s.slug}`}
              className="card p-5 hover:border-brand-400 transition text-center"
            >
              <div className="font-semibold text-gray-900 capitalize">
                {s.topic} coloring pages
              </div>
              <div className="text-xs text-gray-500 mt-1">8 free designs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tier 2 — modifier combinations, compact text list */}
      <section className="mx-auto max-w-6xl px-4 py-10 bg-orange-50/40 rounded-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Coloring pages by audience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tier2.map((s) => (
            <Link
              key={s.slug}
              href={`/coloring-pages/${s.slug}`}
              className="text-sm text-gray-800 hover:text-brand-700 hover:underline px-2 py-1"
            >
              · {s.title.replace(/ — Printable PDF$/, '')}
            </Link>
          ))}
        </div>
      </section>

      {/* Tier 3 — long-tail */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Specialty &amp; long-tail
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tier3.map((s) => (
            <Link
              key={s.slug}
              href={`/coloring-pages/${s.slug}`}
              className="text-sm text-gray-800 hover:text-brand-700 hover:underline px-2 py-1"
            >
              · {s.title.replace(/ — Printable PDF$/, '')}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
