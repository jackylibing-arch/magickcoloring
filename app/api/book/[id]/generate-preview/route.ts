// POST /api/book/[id]/generate-preview
// Generates the cover + first 2 page images for the free preview.
// Idempotent: if all 3 are already present, returns immediately.
// Called fire-and-forget by /api/book/create after the skeleton is saved,
// and may also be safely re-triggered by the client if it sees a stuck state.

import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook } from '@/lib/bookStore';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';
import { getCoverScene } from '@/lib/templates';

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

  // Already done?
  if (book.coverImageUrl && book.pageImageUrls[0] && book.pageImageUrls[1]) {
    return NextResponse.json({ status: 'preview-ready' });
  }

  try {
    const coverPrompt = buildBookPagePrompt(getCoverScene(book.theme, book.childName));
    const page1Prompt = buildBookPagePrompt(book.story[0].scene);
    const page2Prompt = buildBookPagePrompt(book.story[1].scene);

    const [coverUrl, page1Url, page2Url] = await Promise.all([
      generateColoringImage(coverPrompt),
      generateColoringImage(page1Prompt),
      generateColoringImage(page2Prompt),
    ]);

    const updatedImageUrls = [...book.pageImageUrls];
    updatedImageUrls[0] = page1Url;
    updatedImageUrls[1] = page2Url;

    await updateBook(book.id, {
      coverImageUrl: coverUrl,
      pageImageUrls: updatedImageUrls,
    });

    return NextResponse.json({ status: 'preview-ready' });
  } catch (err: any) {
    console.error('preview generation failed', err);
    await updateBook(book.id, { status: 'error', error: err.message || 'unknown' });
    return NextResponse.json(
      { error: `Preview generation failed: ${err.message || 'unknown'}` },
      { status: 502 }
    );
  }
}
