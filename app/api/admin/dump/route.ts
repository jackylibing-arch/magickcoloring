// GET /api/admin/dump?id=BOOK_ID&token=ADMIN_TOKEN
// Returns the raw KV record for a book, plus environment diagnostics.

import { NextRequest, NextResponse } from 'next/server';
import { getBook } from '@/lib/bookStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const token = searchParams.get('token');
  const expected = process.env.ADMIN_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  }

  const book = await getBook(id);

  return NextResponse.json({
    book,
    diag: {
      hasKvUrl: Boolean(process.env.KV_REST_API_URL),
      hasKvToken: Boolean(process.env.KV_REST_API_TOKEN),
      kvUrlHost: process.env.KV_REST_API_URL
        ? new URL(process.env.KV_REST_API_URL).host
        : null,
      kvTokenLast4: process.env.KV_REST_API_TOKEN?.slice(-4) ?? null,
      vercelEnv: process.env.VERCEL_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      lambdaId: Math.random().toString(36).slice(2, 8), // unique per cold start
    },
  });
}
