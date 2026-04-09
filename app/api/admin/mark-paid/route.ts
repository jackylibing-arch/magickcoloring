// POST /api/admin/mark-paid?id=BOOK_ID&token=ADMIN_TOKEN
// Temporary admin endpoint to manually mark a book as paid when the Stripe
// webhook fails to update KV. Guarded by ADMIN_TOKEN env var.

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

const ROUTE_VERSION = 'v4-direct-kv-2026-04-09';
const KEY = (id: string) => `book:${id}`;
const TTL = 60 * 60 * 24 * 30;

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

  // Direct KV access — bypassing bookStore module to rule out any
  // bundle/cache issue with that module.
  const book: any = await kv.get(KEY(id));
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }

  // Atomic recovery: mark paid + generate missing images + mark ready.
  await kv.set(KEY(id), { ...book, paid: true, status: 'generating' }, { ex: TTL });

  const missingIndices = (book.pageImageUrls as (string | null)[])
    .map((u: string | null, i: number) => (u === null ? i : -1))
    .filter((i: number) => i >= 0);

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

  const finalBook = {
    ...book,
    paid: true,
    pageImageUrls: updatedImageUrls,
    status: 'ready',
  };
  await kv.set(KEY(id), finalBook, { ex: TTL });

  // Read it back to confirm KV persistence (not just local memory).
  const verify: any = await kv.get(KEY(id));

  return NextResponse.json({
    ok: true,
    routeVersion: ROUTE_VERSION,
    id,
    diag: {
      kvUrlHost: process.env.KV_REST_API_URL
        ? new URL(process.env.KV_REST_API_URL).host
        : null,
      kvTokenLast4: process.env.KV_REST_API_TOKEN?.slice(-4) ?? null,
      vercelEnv: process.env.VERCEL_ENV,
      lambdaId: Math.random().toString(36).slice(2, 8),
    },
    before: {
      paid: book.paid,
      status: book.status,
      filled: book.pageImageUrls.filter(Boolean).length,
    },
    verifyAfterRead: {
      paid: verify?.paid,
      status: verify?.status,
      filled: verify?.pageImageUrls?.filter(Boolean).length,
    },
  });
}
