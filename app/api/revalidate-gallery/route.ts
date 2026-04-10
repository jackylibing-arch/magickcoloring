// On-demand ISR revalidation for /coloring-pages/[slug] after the batch
// generator writes a new gallery to KV. Without this, pages stay stuck on
// the "preparing" placeholder for 24h (revalidate = 86400) until the next
// build or natural ISR refresh.
//
// Usage:
//   POST /api/revalidate-gallery?slug=unicorn-coloring-pages
//   Header: x-revalidate-token: <REVALIDATE_TOKEN>

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const token = req.headers.get('x-revalidate-token');
  const expected = process.env.REVALIDATE_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  revalidatePath(`/coloring-pages/${slug}`);
  revalidatePath('/coloring-pages');
  return NextResponse.json({ revalidated: true, slug });
}
