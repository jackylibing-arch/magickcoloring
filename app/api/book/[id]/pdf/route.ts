// GET /api/book/[id]/pdf
// Renders the personalized coloring book PDF on demand from cached image URLs.
// No Vercel Blob — fal.ai delivery URLs are persistent enough for our needs,
// and re-rendering is cheap (no AI calls, just react-pdf).

import { NextRequest, NextResponse } from 'next/server';
import { getBook } from '@/lib/bookStore';
import { renderBookPdf } from '@/lib/pdfBook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }
  if (!book.paid) {
    return NextResponse.json({ error: 'Book not paid.' }, { status: 402 });
  }
  if (book.status !== 'ready') {
    return NextResponse.json({ error: 'Book not ready yet.' }, { status: 409 });
  }

  const pdfBuffer = await renderBookPdf(book);
  const filename = `${book.childName.replace(/[^a-zA-Z0-9]/g, '_')}-coloring-book.pdf`;

  return new NextResponse(pdfBuffer as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
