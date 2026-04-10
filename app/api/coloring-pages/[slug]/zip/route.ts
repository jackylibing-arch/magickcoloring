// GET /api/coloring-pages/[slug]/zip
// Streams all 8 pre-generated coloring pages for a slug as a single ZIP.
// No fal.ai cost — it just re-fetches the already-stored URLs and bundles them.

import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { getGallery } from '@/lib/galleryStore';
import { getSlug } from '@/lib/coloringSlugs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = getSlug(params.slug);
  if (!slug) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const gallery = await getGallery(slug.slug);
  if (!gallery || gallery.imageUrls.length === 0) {
    return NextResponse.json(
      { error: 'Gallery not ready yet.' },
      { status: 404 }
    );
  }

  const zip = new JSZip();

  // Fetch all images in parallel — these are public fal.ai CDN URLs.
  const files = await Promise.all(
    gallery.imageUrls.map(async (url, i) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch image ${i + 1}: ${res.status}`);
      const buf = await res.arrayBuffer();
      return { name: `${slug.slug}-${i + 1}.png`, buf };
    })
  );

  for (const f of files) {
    zip.file(f.name, f.buf);
  }

  const blob = await zip.generateAsync({ type: 'arraybuffer' });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug.slug}.zip"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
