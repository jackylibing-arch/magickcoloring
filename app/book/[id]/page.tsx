import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBook } from '@/lib/bookStore';
import { getThemeLabel, getBookTitle } from '@/lib/templates';
import BookPaywall from '@/components/BookPaywall';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const book = await getBook(params.id);
  if (!book) return { title: 'Book not found' };
  return {
    title: `${book.childName}'s Personalized Coloring Book`,
    description: `A 20-page printable coloring storybook starring ${book.childName}.`,
    robots: { index: false, follow: false }, // private preview
  };
}

export default async function BookPreviewPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) notFound();

  // If already paid and ready, redirect to success page.
  if (book.paid) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">This book has already been unlocked!</h1>
        <p className="text-gray-600 mb-6">
          {book.status === 'ready'
            ? 'Your PDF is ready to download.'
            : 'We are finishing your book...'}
        </p>
        <a href={`/book/${book.id}/success`} className="btn-primary">
          Go to download page
        </a>
      </section>
    );
  }

  const bookTitle = getBookTitle(book.theme, book.childName);
  const totalPages = book.story.length;
  const previewCount = 2; // pages actually shown unblurred
  const progressPct = Math.round((previewCount / totalPages) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pb-32">
      <div className="text-center mb-6">
        <p className="text-sm uppercase tracking-wider text-brand-700 font-semibold mb-2">
          Free Preview · {getThemeLabel(book.theme)}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900">
          {bookTitle}
        </h1>
        <p className="mt-3 text-gray-600">
          A personalized {totalPages}-page coloring storybook starring {book.childName}.
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>You've seen {previewCount} of {totalPages} pages</span>
          <span className="font-semibold text-orange-700">{totalPages - previewCount} more locked</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-orange-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Cover */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Cover</p>
        <h2 className="text-center font-display text-2xl font-bold text-gray-900 mb-3">
          {bookTitle}
        </h2>
        <div className="mx-auto max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.coverImageUrl}
            alt="Coloring book cover"
            className="w-full rounded-xl border border-gray-200 bg-white"
          />
        </div>
      </div>

      {/* Page 1 */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">
          Page 1 of {totalPages}
        </p>
        <p className="text-center text-lg text-gray-800 mb-3 italic">"{book.story[0].text}"</p>
        <div className="mx-auto max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.pageImageUrls[0] ?? ''}
            alt="Page 1"
            className="w-full rounded-xl border border-gray-200 bg-white"
          />
        </div>
      </div>

      {/* Page 2 */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">
          Page 2 of {totalPages}
        </p>
        <p className="text-center text-lg text-gray-800 mb-3 italic">"{book.story[1].text}"</p>
        <div className="mx-auto max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.pageImageUrls[1] ?? ''}
            alt="Page 2"
            className="w-full rounded-xl border border-gray-200 bg-white"
          />
        </div>
      </div>

      {/* Page 3 — locked cliffhanger */}
      <div className="card p-6 mb-6 relative overflow-hidden border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
        <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-2 text-center">
          Page 3 of {totalPages} · 🔒 Locked
        </p>
        <p className="text-center text-sm font-semibold text-orange-900 mb-3 uppercase tracking-wide">
          What happens next?
        </p>
        <p className="text-center text-lg text-gray-700 mb-4 italic blur-sm select-none">
          "{book.story[2].text}"
        </p>
        <div className="mx-auto max-w-md relative">
          <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center border border-orange-300 shadow-inner">
            <div className="text-center px-6">
              <div className="text-6xl mb-3">🔒</div>
              <p className="text-base font-bold text-orange-900 mb-1">
                The story is just getting started
              </p>
              <p className="text-sm text-orange-800">
                Unlock {totalPages - previewCount} more pages of {book.childName}'s adventure
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-orange-700 mt-4 font-medium">
          ↓ Unlock below to see how it ends ↓
        </p>
      </div>

      <div id="unlock-cta" className="scroll-mt-6">
        <BookPaywall bookId={book.id} childName={book.childName} totalPages={totalPages} />
      </div>

      {/* Sticky bottom CTA (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-200 bg-white/95 backdrop-blur-sm shadow-lg md:hidden">
        <a href="#unlock-cta" className="block px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 line-through leading-none">$12.00</span>
              <span className="text-lg font-extrabold text-brand-700 leading-tight">$5.90</span>
            </div>
            <span className="flex-1 text-center rounded-xl bg-gradient-to-r from-orange-500 to-brand-600 text-white font-bold py-3 text-sm shadow">
              🎨 Unlock Full Storybook
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
