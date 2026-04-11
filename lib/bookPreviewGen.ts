// Shared preview-generation logic.
// Used by:
//   - /api/book/create (fired via waitUntil after the response, so it runs
//     in the background but on the same lambda instance — no HTTP self-call,
//     no apex/www redirect issue, no killed-fetch issue)
//   - /api/book/[id]/generate-preview (manual retry endpoint for the client)
//
// IMPORTANT: Since fal.ai image prompts don't embed the child's name, the
// cover + page 1/2 images are identical across all users who pick the same
// theme. We cache them per-theme in KV (see lib/themeAssetCache.ts). This
// drops per-book fal.ai cost to ~$0 once the cache is warm.

import { getBook, updateBook } from './bookStore';
import { generateColoringImage, buildBookPagePrompt } from './falImage';
import { getCoverScene } from './templates';
import {
  getCachedCover,
  getCachedPage,
  setCachedCover,
  setCachedPage,
} from './themeAssetCache';

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
    // Parallel cache lookups.
    const [cachedCover, cachedP0, cachedP1] = await Promise.all([
      getCachedCover(book.theme),
      getCachedPage(book.theme, 0),
      getCachedPage(book.theme, 1),
    ]);

    // Cover — cache or generate.
    const coverUrl =
      cachedCover ??
      (await (async () => {
        const url = await generateColoringImage(
          buildBookPagePrompt(getCoverScene(book.theme, book.childName))
        );
        await setCachedCover(book.theme, url);
        return url;
      })());

    // Page 0 (story page 1) — cache or generate.
    const page1Url =
      cachedP0 ??
      (await (async () => {
        const url = await generateColoringImage(
          buildBookPagePrompt(book.story[0].scene)
        );
        await setCachedPage(book.theme, 0, url);
        return url;
      })());

    // Page 1 (story page 2) — cache or generate.
    const page2Url =
      cachedP1 ??
      (await (async () => {
        const url = await generateColoringImage(
          buildBookPagePrompt(book.story[1].scene)
        );
        await setCachedPage(book.theme, 1, url);
        return url;
      })());

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
