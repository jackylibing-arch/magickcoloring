// POST /api/book/create
// Body: { childName, age, theme }
// Creates a new book, generates story (templates), generates the cover image
// and the first 2 page images (the free preview), saves to KV, returns id.

import { NextRequest, NextResponse } from 'next/server';
import { generateColoringImage, buildBookPagePrompt } from '@/lib/falImage';
import {
  generateStory,
  getCoverScene,
  THEMES,
  AGE_OPTIONS,
  type Theme,
} from '@/lib/templates';
import { saveBook, newBookId, type Book } from '@/lib/bookStore';
import { isPromptSafe } from '@/lib/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // need ~30s for 3 image generations

const VALID_THEMES = new Set(THEMES.map((t) => t.id));

export async function POST(req: NextRequest) {
  let body: { childName?: string; age?: number; theme?: Theme };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const childName = (body.childName || '').trim();
  const age = Number(body.age);
  const theme = body.theme as Theme;

  if (childName.length < 1 || childName.length > 30) {
    return NextResponse.json({ error: "Child's name must be 1-30 characters." }, { status: 400 });
  }
  if (!isPromptSafe(childName)) {
    return NextResponse.json({ error: 'Please use a real name.' }, { status: 400 });
  }
  if (!AGE_OPTIONS.includes(age as any)) {
    return NextResponse.json({ error: 'Invalid age.' }, { status: 400 });
  }
  if (!VALID_THEMES.has(theme)) {
    return NextResponse.json({ error: 'Invalid theme.' }, { status: 400 });
  }

  const story = generateStory(theme, childName, age);
  const id = newBookId();

  // Generate the cover and first 2 page images in parallel.
  // (3 fal.ai calls, ~10s each, but parallel so ~10s total wall time.)
  let coverUrl: string;
  let page1Url: string;
  let page2Url: string;
  try {
    const coverPrompt = buildBookPagePrompt(getCoverScene(theme, childName));
    const page1Prompt = buildBookPagePrompt(story[0].scene);
    const page2Prompt = buildBookPagePrompt(story[1].scene);
    [coverUrl, page1Url, page2Url] = await Promise.all([
      generateColoringImage(coverPrompt),
      generateColoringImage(page1Prompt),
      generateColoringImage(page2Prompt),
    ]);
  } catch (err: any) {
    console.error('book preview generation failed', err);
    return NextResponse.json(
      { error: `Generation failed: ${err.message || 'unknown error'}` },
      { status: 502 }
    );
  }

  const pageImageUrls: (string | null)[] = new Array(story.length).fill(null);
  pageImageUrls[0] = page1Url;
  pageImageUrls[1] = page2Url;

  const book: Book = {
    id,
    createdAt: Date.now(),
    childName,
    age,
    theme,
    story,
    coverImageUrl: coverUrl,
    pageImageUrls,
    status: 'preview',
    paid: false,
  };

  await saveBook(book);

  return NextResponse.json({
    id,
    childName,
    theme,
    coverImageUrl: coverUrl,
    previewPages: [
      { pageNumber: 1, text: story[0].text, imageUrl: page1Url },
      { pageNumber: 2, text: story[1].text, imageUrl: page2Url },
      { pageNumber: 3, text: story[2].text, imageUrl: null, locked: true },
    ],
    totalPages: story.length,
  });
}
