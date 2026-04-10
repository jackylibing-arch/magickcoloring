// GET /api/book/[id]/status
// Returns minimal status info for the client to poll.

import { NextRequest, NextResponse } from 'next/server';
import { getBook } from '@/lib/bookStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }
  const filledCount = book.pageImageUrls.filter((u) => u !== null).length;
  const previewReady = Boolean(
    book.coverImageUrl && book.pageImageUrls[0] && book.pageImageUrls[1]
  );
  return NextResponse.json({
    id: book.id,
    status: book.status,
    paid: book.paid,
    childName: book.childName,
    theme: book.theme,
    coverImageUrl: book.coverImageUrl,
    page1ImageUrl: book.pageImageUrls[0] ?? null,
    page2ImageUrl: book.pageImageUrls[1] ?? null,
    previewReady,
    progress: {
      filled: filledCount,
      total: book.pageImageUrls.length,
    },
    pdfReady: book.status === 'ready',
    error: book.error,
  });
}
