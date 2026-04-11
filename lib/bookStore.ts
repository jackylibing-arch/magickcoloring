// Book metadata storage backed by Vercel KV (Upstash Redis).
// KV-only — no in-memory fallback. We had a critical bug where warm lambdas
// without KV env vars silently used a private in-memory Map, causing
// per-lambda state divergence in production. Fail loud instead.

import { redis } from './redis';
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
  coverImageUrl: string | null; // null until preview-generation finishes
  pageImageUrls: (string | null)[]; // length = story.length, null = not yet generated
  // Lifecycle
  status: BookStatus;
  paid: boolean;
  pdfUrl?: string;
  error?: string;
};

const KV_PREFIX = 'book:';

function assertKv(): void {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error(
      'KV not configured: missing KV_REST_API_URL or KV_REST_API_TOKEN env var.'
    );
  }
}

export async function saveBook(book: Book): Promise<void> {
  assertKv();
  // Unpaid previews expire in 24h (cheap cleanup for abandoned/abusive flows).
  // Once paid, extend to 30 days so the customer can re-download their PDF.
  const ttlSeconds = book.paid ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  await redis.set(KV_PREFIX + book.id, book, { ex: ttlSeconds });
}

export async function getBook(id: string): Promise<Book | null> {
  assertKv();
  return (await redis.get<Book>(KV_PREFIX + id)) ?? null;
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
