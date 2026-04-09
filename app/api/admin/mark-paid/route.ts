// POST /api/admin/mark-paid?id=BOOK_ID&token=ADMIN_TOKEN
// Temporary admin endpoint to manually mark a book as paid when the Stripe
// webhook fails to update KV. Guarded by ADMIN_TOKEN env var.

import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook } from '@/lib/bookStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  await updateBook(id, { paid: true, status: 'generating' });
  return NextResponse.json({ ok: true, id, before: { paid: book.paid, status: book.status } });
}
