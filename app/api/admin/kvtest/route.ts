// GET /api/admin/kvtest?token=ADMIN_TOKEN
// Writes a fresh test key, reads it back, returns both. Confirms KV write/read.

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const testKey = `test:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  const testValue = {
    written: Date.now(),
    nonce: Math.random().toString(36).slice(2),
    note: 'kvtest probe',
  };

  await kv.set(testKey, testValue, { ex: 600 });
  const readBack = await kv.get(testKey);
  await new Promise((r) => setTimeout(r, 200));
  const readBack2 = await kv.get(testKey);

  // Also check book:bed29qcjl right now
  const bookNow = await kv.get('book:bed29qcjl');

  return NextResponse.json({
    testKey,
    wrote: testValue,
    readBack,
    readBack2,
    bookNowSummary: bookNow
      ? {
          // @ts-ignore
          status: bookNow.status,
          // @ts-ignore
          paid: bookNow.paid,
          // @ts-ignore
          filled: (bookNow as any).pageImageUrls?.filter(Boolean).length,
        }
      : null,
  });
}
