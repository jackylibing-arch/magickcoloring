import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBook } from '@/lib/bookStore';
import { getThemeLabel, getBookTitle } from '@/lib/templates';
import BookPaywall from '@/components/BookPaywall';
import BookPreviewImages from '@/components/BookPreviewImages';

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

      <BookPreviewImages
        bookId={book.id}
        childName={book.childName}
        totalPages={totalPages}
        storyTexts={{
          p1: book.story[0].text,
          p2: book.story[1].text,
          p3: book.story[2].text,
        }}
        initial={{
          coverImageUrl: book.coverImageUrl,
          page1ImageUrl: book.pageImageUrls[0] ?? null,
          page2ImageUrl: book.pageImageUrls[1] ?? null,
        }}
      />

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
