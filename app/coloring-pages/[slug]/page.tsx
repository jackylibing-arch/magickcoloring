// /coloring-pages/[slug]
// Programmatic SEO landing page. Reads pre-generated images from KV and
// renders an SEO-optimized gallery with download links + funnel CTAs to
// the free tool and the personalized book product.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COLORING_SLUGS, getSlug } from '@/lib/coloringSlugs';
import { getGallery } from '@/lib/galleryStore';
import { SITE } from '@/lib/site';

// ISR: rebuild a slug at most once a day if traffic comes in. Galleries are
// pre-generated, so cache forever in practice.
export const revalidate = 86400;

export async function generateStaticParams() {
  // Pre-render every slug at build time. ~199 routes, all static.
  return COLORING_SLUGS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = getSlug(params.slug);
  if (!slug) return { title: 'Not found' };
  const url = `${SITE.url}/coloring-pages/${slug.slug}`;
  return {
    title: slug.title,
    description: slug.description,
    alternates: { canonical: `/coloring-pages/${slug.slug}` },
    openGraph: {
      title: slug.title,
      description: slug.description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: slug.title,
      description: slug.description,
    },
  };
}

export default async function ColoringPagesSlug({
  params,
}: {
  params: { slug: string };
}) {
  const slug = getSlug(params.slug);
  if (!slug) notFound();

  const gallery = await getGallery(slug.slug);
  // Gallery may not exist yet (we haven't run the batch). Render the page
  // anyway with placeholder cards so the route works in development and
  // doesn't 404 search engines if a slug ships ahead of its assets.
  const images = gallery?.imageUrls ?? [];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: images.map((url, i) => ({
      '@type': 'ImageObject',
      position: i + 1,
      contentUrl: url,
      name: `${slug.topic} coloring page ${i + 1}`,
      description: slug.prompts[i],
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Coloring Pages', item: `${SITE.url}/coloring-pages` },
      { '@type': 'ListItem', position: 3, name: slug.title, item: `${SITE.url}/coloring-pages/${slug.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mx-auto max-w-5xl px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/coloring-pages" className="hover:text-brand-700">Coloring Pages</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{slug.topic}</span>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-6 pb-4 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {slug.title.replace(/ — Printable PDF$/, '')}
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          {slug.description}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🆓 100% free</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🖨 Print at home</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">📄 No signup</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">⚡ Instant download</span>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        {images.length === 0 ? (
          <div className="card p-10 text-center text-gray-600">
            <div className="text-4xl mb-3">🎨</div>
            <p className="font-semibold mb-2">These coloring pages are being prepared.</p>
            <p className="text-sm">Check back shortly, or{' '}
              <Link href="/free-tool" className="text-brand-700 underline">
                generate your own with our free tool
              </Link>.
            </p>
          </div>
        ) : (
          <>
          <div className="mb-5 flex justify-center">
            <a
              href={`/api/coloring-pages/${slug.slug}/zip`}
              className="btn-primary inline-flex items-center gap-2"
            >
              📦 Download all {images.length} as ZIP
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((url, i) => (
              <div key={url} className="card p-3 flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${slug.topic} coloring page ${i + 1}`}
                  className="w-full aspect-square object-contain rounded-lg border border-gray-200 bg-white"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <a
                  href={`/api/coloring-pages/image-proxy?url=${encodeURIComponent(url)}&filename=${slug.slug}-${i + 1}.png`}
                  download={`${slug.slug}-${i + 1}.png`}
                  className="mt-3 block text-center rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2"
                >
                  ⬇ Download
                </a>
              </div>
            ))}
          </div>
          </>
        )}
      </section>

      {/* Mid-page CTA: free tool */}
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="card p-6 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Want a different {slug.topic}?
          </h2>
          <p className="text-gray-700 mb-4">
            Type any idea — get a brand-new printable coloring page in seconds. Free, no signup.
          </p>
          <Link
            href={`/free-tool?prompt=${encodeURIComponent(slug.topic)}`}
            className="inline-block rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
          >
            ✨ Try the Free Generator
          </Link>
        </div>
      </section>

      {/* Bottom CTA: paid book */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 text-center">
          <p className="text-xs uppercase tracking-wider text-orange-700 font-bold mb-2">
            ⭐ Loved by 10,000+ families
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            Make your child the hero of their own coloring book
          </h2>
          <p className="text-gray-700 mb-5">
            A 20-page printable storybook starring your child by name — see a free 3-page preview before you pay.
          </p>
          <Link href="/" className="btn-primary inline-block text-base">
            🎨 Create a Personalized Book — from $5.90
          </Link>
        </div>
      </section>

      {/* Related slugs */}
      <RelatedColoringPages currentSlug={slug.slug} />
    </>
  );
}

function RelatedColoringPages({ currentSlug }: { currentSlug: string }) {
  // Show up to 12 related slugs from the same tier as the current page,
  // excluding the current one. Helps internal linking.
  const current = getSlug(currentSlug);
  if (!current) return null;
  const related = COLORING_SLUGS.filter(
    (s) => s.slug !== currentSlug && (s.tier === current.tier || s.topic === current.topic)
  ).slice(0, 12);
  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        More free coloring pages
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={`/coloring-pages/${r.slug}`}
            className="card p-3 hover:border-brand-400 transition text-sm text-gray-800"
          >
            {r.title.replace(/ — Printable PDF$/, '')}
          </Link>
        ))}
      </div>
    </section>
  );
}
