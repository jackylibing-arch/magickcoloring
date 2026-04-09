// POST /api/admin/mark-paid?id=BOOK_ID&token=ADMIN_TOKEN
// Temporary admin endpoint to manually mark a book as paid when the Stripe
// webhook fails to update KV. Guarded by ADMIN_TOKEN env var.

import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook } from '@/lib/bookStore';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ROUTE_VERSION = 'v3-kv-only-2026-04-09';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const token = searchParams.get('token');
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_TOKEN not configured.' }, { status: 500 });
  }
  if (token !== expected) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ error: 'Missing id query param.' }, { status: 400 });
  }

  const book = await getBook(id);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }

  // Atomic recovery: mark paid + generate missing images + mark ready,
  // all in this single request. No fire-and-forget, no client involvement.
  await updateBook(id, { paid: true, status: 'generating' });

  const missingIndices = book.pageImageUrls
    .map((u, i) => (u === null ? i : -1))
    .filter((i) => i >= 0);

  const generated: { i: number; url: string }[] = [];
  const CONCURRENCY = 6;
  for (let start = 0; start < missingIndices.length; start += CONCURRENCY) {
    const batch = missingIndices.slice(start, start + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (i) => {
        const prompt = buildBookPagePrompt(book.story[i].scene);
        const url = await generateColoringImage(prompt);
        return { i, url };
      })
    );
    generated.push(...batchResults);
  }

  const updatedImageUrls = [...book.pageImageUrls];
  for (const { i, url } of generated) {
    updatedImageUrls[i] = url;
  }

  const finalBook = await updateBook(id, {
    paid: true,
    pageImageUrls: updatedImageUrls,
    status: 'ready',
  });

  return NextResponse.json({
    ok: true,
    routeVersion: ROUTE_VERSION,
    id,
    before: { paid: book.paid, status: book.status, filled: book.pageImageUrls.filter(Boolean).length },
    after: {
      paid: finalBook?.paid,
      status: finalBook?.status,
      filled: finalBook?.pageImageUrls.filter(Boolean).length,
    },
  });
}
