// Manually mark a book as paid and kick off build.
// Use when webhook failed but payment actually succeeded.
//
// Usage: npx tsx scripts/markBookPaid.ts <bookId>

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { getBook, updateBook } from '../lib/bookStore';
import { SITE } from '../lib/site';

async function main() {
  const bookId = process.argv[2];
  if (!bookId) {
    console.error('Usage: npx tsx scripts/markBookPaid.ts <bookId>');
    process.exit(1);
  }
  const book = await getBook(bookId);
  if (!book) {
    console.error('Book not found:', bookId);
    process.exit(1);
  }
  console.log('Before:', { paid: book.paid, status: book.status });
  if (!book.paid) {
    await updateBook(bookId, { paid: true, status: 'generating' });
    console.log('Marked paid.');
  } else {
    console.log('Already paid.');
  }
  const url = `${SITE.url}/api/book/${bookId}/build`;
  console.log('Kicking off build:', url);
  const res = await fetch(url, { method: 'POST' });
  console.log('Build response:', res.status, await res.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
