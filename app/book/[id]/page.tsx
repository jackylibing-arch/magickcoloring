import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBook } from '@/lib/bookStore';
import { getThemeLabel } from '@/lib/templates';
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-wider text-brand-700 font-semibold mb-2">
          Free Preview · {getThemeLabel(book.theme)}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900">
          {book.childName}'s Coloring Storybook
        </h1>
        <p className="mt-3 text-gray-600">
          Here are the first 3 pages of your child's personalized 20-page book.
        </p>
      </div>

      {/* Cover */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Cover</p>
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
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Page 1</p>
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
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Page 2</p>
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

      {/* Page 3 — locked */}
      <div className="card p-6 mb-6 relative overflow-hidden">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Page 3 🔒</p>
        <p className="text-center text-lg text-gray-800 mb-3 italic blur-sm select-none">
          "{book.story[2].text}"
        </p>
        <div className="mx-auto max-w-md relative">
          <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border border-orange-200">
            <div className="text-center">
              <div className="text-6xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-orange-900">
                Unlock 18 more pages of {book.childName}'s adventure
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookPaywall bookId={book.id} childName={book.childName} totalPages={book.story.length} />
    </div>
  );
}
