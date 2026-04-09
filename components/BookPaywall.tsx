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
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        Unlock {childName}'s Full Storybook
      </h2>
      <p className="text-center text-gray-700 mb-6">
        {totalPages} pages · Printable PDF · Personalized story
      </p>

      <ul className="max-w-md mx-auto space-y-2 mb-6 text-gray-800">
        <li className="flex items-start gap-2">
          <span className="text-brand-600 mt-1">✓</span>
          <span>All <strong>{totalPages} pages</strong> of {childName}'s personalized story</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-brand-600 mt-1">✓</span>
          <span>High-resolution, letter-size <strong>print-ready PDF</strong></span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-brand-600 mt-1">✓</span>
          <span>Instant download — no shipping, no waiting</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-brand-600 mt-1">✓</span>
          <span>Free for personal &amp; classroom use</span>
        </li>
      </ul>

      <div className="text-center mb-5">
        <span className="text-gray-400 line-through text-lg mr-2">$12.00</span>
        <span className="text-4xl font-extrabold text-brand-700">$5.90</span>
        <div className="text-xs text-orange-700 font-semibold mt-1 uppercase tracking-wide">
          Limited launch price
        </div>
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
        {loading ? 'Redirecting to checkout…' : `🎨 Unlock Full Storybook — $5.90`}
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
        <span className="flex items-center gap-1">🔒 Secure Stripe checkout</span>
        <span className="flex items-center gap-1">⚡ Instant download</span>
        <span className="flex items-center gap-1">💳 No subscription</span>
      </div>
    </div>
  );
}
