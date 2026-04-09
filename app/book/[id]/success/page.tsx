import type { Metadata } from 'next';
import BookSuccessClient from '@/components/BookSuccessClient';

export const metadata: Metadata = {
  title: 'Your Coloring Book is Being Created',
  robots: { index: false, follow: false },
};

export default function BookSuccessPage({ params }: { params: { id: string } }) {
  return <BookSuccessClient bookId={params.id} />;
}
