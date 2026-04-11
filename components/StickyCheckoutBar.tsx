'use client';

import { useState } from 'react';

export default function StickyCheckoutBar({
  bookId,
  childName,
}: {
  bookId: string;
  childName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setLoading(false);
        alert(data.error || 'Failed to create checkout.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setLoading(false);
      alert('Network error. Please try again.');
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-200 bg-white/95 backdrop-blur-sm shadow-2xl">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="block w-full px-4 py-3 max-w-3xl mx-auto disabled:opacity-60"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col flex-shrink-0">
            <span className="text-xs text-gray-500 line-through leading-none">$12.00</span>
            <span className="text-lg font-extrabold text-brand-700 leading-tight">$5.90</span>
          </div>
          <span className="flex-1 text-center rounded-xl bg-gradient-to-r from-orange-500 to-brand-600 text-white font-bold py-3 px-4 text-sm md:text-base shadow-lg">
            {loading ? 'Redirecting…' : `🎨 Unlock ${childName}'s Storybook`}
          </span>
        </div>
      </button>
    </div>
  );
}
