// Book metadata storage backed by Vercel KV.
// Falls back to in-memory Map for local dev when KV is not configured.

import { kv } from '@vercel/kv';
import type { Theme, StoryPage } from './templates';

export type BookStatus =
  | 'preview'        // Created, free preview ready (cover + first 2 page images)
  | 'generating'    // Paid, generating remaining images
  | 'ready'         // PDF generated, downloadable
  | 'error';

export type Book = {
  id: string;
  createdAt: number;
  // Inputs
  childName: string;
  age: number;
  theme: Theme;
  // Story
  story: StoryPage[];
  // Image URLs (parallel to story pages by index, plus index 0 = cover)
  coverImageUrl: string;
  pageImageUrls: (string | null)[]; // length = story.length, null = not yet generated
  // Lifecycle
  status: BookStatus;
  paid: boolean;
  pdfUrl?: string;
  error?: string;
};

const KV_PREFIX = 'book:';
const memStore = new Map<string, Book>();

function hasKV(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function saveBook(book: Book): Promise<void> {
  if (hasKV()) {
    await kv.set(KV_PREFIX + book.id, book, { ex: 60 * 60 * 24 * 30 }); // 30 days
  } else {
    memStore.set(book.id, book);
  }
}

export async function getBook(id: string): Promise<Book | null> {
  if (hasKV()) {
    return (await kv.get<Book>(KV_PREFIX + id)) ?? null;
  }
  return memStore.get(id) ?? null;
}

export async function updateBook(
  id: string,
  patch: Partial<Book>
): Promise<Book | null> {
  const existing = await getBook(id);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  await saveBook(next);
  return next;
}

// Random short id (URL-friendly, ~9 chars)
export function newBookId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}
