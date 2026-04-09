// POST /api/book/[id]/build
// Generates the remaining 18 page images in parallel, renders the PDF,
// uploads to Vercel Blob, marks the book ready.
//
// Idempotent: if status === 'ready', returns immediately. If 'generating',
// returns generating (avoids duplicate work — best-effort, not locked).

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getBook, updateBook } from '@/lib/bookStore';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';
import { renderBookPdf } from '@/lib/pdfBook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }
  if (!book.paid) {
    return NextResponse.json({ error: 'Book not paid.' }, { status: 402 });
  }
  if (book.status === 'ready' && book.pdfUrl) {
    return NextResponse.json({ status: 'ready', pdfUrl: book.pdfUrl });
  }

  // Mark generating (no real lock, best-effort).
  await updateBook(book.id, { status: 'generating' });

  try {
    // 1. Generate all missing page images, throttled to fal.ai concurrency limit (10).
    const missingIndices = book.pageImageUrls
      .map((u, i) => (u === null ? i : -1))
      .filter((i) => i >= 0);

    const CONCURRENCY = 6;
    const generated: { i: number; url: string }[] = [];
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
    const filledBook = { ...book, pageImageUrls: updatedImageUrls };

    // 2. Render PDF.
    const pdfBuffer = await renderBookPdf(filledBook);

    // 3. Upload to Vercel Blob.
    const blobName = `books/${book.id}/${book.childName.replace(/[^a-zA-Z0-9]/g, '_')}-coloring-book.pdf`;
    const { url: pdfUrl } = await put(blobName, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    // 4. Save final book state.
    await updateBook(book.id, {
      pageImageUrls: updatedImageUrls,
      pdfUrl,
      status: 'ready',
    });

    return NextResponse.json({ status: 'ready', pdfUrl });
  } catch (err: any) {
    console.error('book build failed', err);
    await updateBook(book.id, { status: 'error', error: err.message || 'unknown' });
    return NextResponse.json(
      { error: `Build failed: ${err.message || 'unknown'}` },
      { status: 502 }
    );
  }
}
