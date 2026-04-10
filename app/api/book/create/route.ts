// POST /api/book/create
// Body: { childName, age, theme }
// Phase 1 (sync, instant): generates the story, saves a skeleton book to KV with
// no images yet, and returns { id } immediately so the client can navigate to
// /book/[id] and show a skeleton screen.
// Phase 2 (fire-and-forget): kicks off /api/book/[id]/generate-preview which
// renders the cover + first 2 pages. The preview page polls /status until those
// images appear and swaps them in progressively.

import { NextRequest, NextResponse } from 'next/server';
import {
  generateStory,
  THEMES,
  AGE_OPTIONS,
  type Theme,
} from '@/lib/templates';
import { saveBook, newBookId, type Book } from '@/lib/bookStore';
import { isPromptSafe } from '@/lib/prompt';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 10; // story generation only — instant

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

  const book: Book = {
    id,
    createdAt: Date.now(),
    childName,
    age,
    theme,
    story,
    coverImageUrl: null,
    pageImageUrls: new Array(story.length).fill(null),
    status: 'preview',
    paid: false,
  };

  await saveBook(book);

  // Fire-and-forget: kick off preview image generation. We don't await it
  // so this endpoint returns instantly. The client will redirect and poll.
  const origin = SITE.url;
  fetch(`${origin}/api/book/${id}/generate-preview`, { method: 'POST' }).catch((e) =>
    console.error('failed to kick off preview generation', e)
  );

  return NextResponse.json({
    id,
    childName,
    theme,
    totalPages: story.length,
  });
}
