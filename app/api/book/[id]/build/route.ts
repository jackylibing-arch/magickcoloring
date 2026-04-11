// POST /api/book/[id]/build
// Generates the remaining 18 page images in parallel, renders the PDF,
// uploads to Vercel Blob, marks the book ready.
//
// Idempotent: if status === 'ready', returns immediately. If 'generating',
// returns generating (avoids duplicate work — best-effort, not locked).

import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook } from '@/lib/bookStore';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';
import { getCachedPage, setCachedPage } from '@/lib/themeAssetCache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }
  if (!book.paid) {
    return NextResponse.json({ error: 'Book not paid.' }, { status: 402 });
  }
  if (book.status === 'ready') {
    return NextResponse.json({ status: 'ready', pdfUrl: `/api/book/${book.id}/pdf` });
  }

  // Mark generating (no real lock, best-effort).
  await updateBook(book.id, { status: 'generating' });

  try {
    // 1. Generate all missing page images, throttled to fal.ai concurrency limit (10).
    const missingIndices = book.pageImageUrls
      .map((u, i) => (u === null ? i : -1))
      .filter((i) => i >= 0);

    // For each missing page, try the theme asset cache first. Only hit fal.ai
    // on cache miss, and write back so the next purchase of this theme is free.
    const CONCURRENCY = 6;
    const generated: { i: number; url: string }[] = [];
    for (let start = 0; start < missingIndices.length; start += CONCURRENCY) {
      const batch = missingIndices.slice(start, start + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (i) => {
          const cached = await getCachedPage(book.theme, i);
          if (cached) return { i, url: cached };
          const prompt = buildBookPagePrompt(book.story[i].scene);
          const url = await generateColoringImage(prompt);
          await setCachedPage(book.theme, i, url);
          return { i, url };
        })
      );
      generated.push(...batchResults);
    }

    const updatedImageUrls = [...book.pageImageUrls];
    for (const { i, url } of generated) {
      updatedImageUrls[i] = url;
    }

    // 2. Save final book state — image URLs only. PDF is rendered on demand
    //    by /api/book/[id]/pdf using these cached fal.ai URLs.
    await updateBook(book.id, {
      pageImageUrls: updatedImageUrls,
      status: 'ready',
    });

    return NextResponse.json({ status: 'ready', pdfUrl: `/api/book/${book.id}/pdf` });
  } catch (err: any) {
    console.error('book build failed', err);
    await updateBook(book.id, { status: 'error', error: err.message || 'unknown' });
    return NextResponse.json(
      { error: `Build failed: ${err.message || 'unknown'}` },
      { status: 502 }
    );
  }
}
