'use client';

import { useState } from 'react';

export default function BookPaywall({
  bookId,
  childName,
  totalPages,
}: {
  bookId: string;
  childName: string;
  totalPages: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to create checkout.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="card p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
        Unlock {childName}'s Full Coloring Storybook
      </h2>
      <p className="text-center text-gray-700 mb-6">
        Get all {totalPages} pages — instantly downloadable, ready to print.
      </p>

      <ul className="max-w-md mx-auto space-y-2 mb-6 text-gray-800">
        <li className="flex items-center gap-2">
          <span className="text-brand-600">✓</span> {totalPages}-page printable PDF
        </li>
        <li className="flex items-center gap-2">
          <span className="text-brand-600">✓</span> {childName}'s name on the cover and every page
        </li>
        <li className="flex items-center gap-2">
          <span className="text-brand-600">✓</span> High-resolution, letter-size, print-ready
        </li>
        <li className="flex items-center gap-2">
          <span className="text-brand-600">✓</span> Free for personal & classroom use
        </li>
      </ul>

      <div className="text-center mb-4">
        <span className="text-gray-400 line-through text-lg mr-2">$12.00</span>
        <span className="text-4xl font-extrabold text-brand-700">$5.90</span>
        <span className="text-sm text-gray-500 ml-2">limited launch price</span>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary w-full text-lg py-4"
      >
        {loading ? 'Redirecting to checkout…' : '🎨 Unlock Full Book — $5.90'}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Secure checkout via Stripe · Instant download after payment
      </p>
    </div>
  );
}
