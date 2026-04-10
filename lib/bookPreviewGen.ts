// Shared preview-generation logic.
// Used by:
//   - /api/book/create (fired via waitUntil after the response, so it runs
//     in the background but on the same lambda instance — no HTTP self-call,
//     no apex/www redirect issue, no killed-fetch issue)
//   - /api/book/[id]/generate-preview (manual retry endpoint for the client)

import { getBook, updateBook } from './bookStore';
import { generateColoringImage, buildBookPagePrompt } from './falImage';
import { getCoverScene } from './templates';

export async function generatePreviewForBook(bookId: string): Promise<void> {
  const book = await getBook(bookId);
  if (!book) {
    console.error('[preview-gen] book not found', bookId);
    return;
  }

  // Idempotent — already done.
  if (book.coverImageUrl && book.pageImageUrls[0] && book.pageImageUrls[1]) {
    return;
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
  } catch (err: any) {
    console.error('[preview-gen] failed', bookId, err?.message || err);
    await updateBook(bookId, { status: 'error', error: err?.message || 'unknown' });
    throw err;
  }
}
