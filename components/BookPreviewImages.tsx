'use client';

// Renders the cover + first 2 pages with progressive loading.
// Initial state may be all-null (just navigated from /create); we poll
// /api/book/[id]/status every 2 seconds until previewReady, then swap in
// the real images. Page 3 is always rendered as the locked cliffhanger.

import { useEffect, useState } from 'react';

type Props = {
  bookId: string;
  childName: string;
  totalPages: number;
  storyTexts: { p1: string; p2: string; p3: string };
  initial: {
    coverImageUrl: string | null;
    page1ImageUrl: string | null;
    page2ImageUrl: string | null;
  };
};

type Images = {
  coverImageUrl: string | null;
  page1ImageUrl: string | null;
  page2ImageUrl: string | null;
};

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 90_000; // 90s safety cap

function isPreviewReady(img: Images): boolean {
  return Boolean(img.coverImageUrl && img.page1ImageUrl && img.page2ImageUrl);
}

function Skeleton({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="aspect-square w-full rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden relative">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          <p className="text-xs text-gray-500 mt-1">Usually ready in ~10 seconds</p>
        </div>
      </div>
    </div>
  );
}

export default function BookPreviewImages({
  bookId,
  childName,
  totalPages,
  storyTexts,
  initial,
}: Props) {
  const [images, setImages] = useState<Images>(initial);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (isPreviewReady(images)) return;

    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/book/${bookId}/status`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          if (data.status === 'error') {
            setErrored(true);
            return;
          }
          const next: Images = {
            coverImageUrl: data.coverImageUrl ?? null,
            page1ImageUrl: data.page1ImageUrl ?? null,
            page2ImageUrl: data.page2ImageUrl ?? null,
          };
          setImages(next);
          if (isPreviewReady(next)) return;
        }
      } catch {
        // network blip — keep polling
      }

      if (Date.now() - startedAt > MAX_POLL_MS) {
        setErrored(true);
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  if (errored) {
    return (
      <div className="card p-6 mb-6 bg-red-50 border-red-200 text-center">
        <p className="text-red-800 font-semibold mb-2">
          We couldn&apos;t finish generating your preview.
        </p>
        <p className="text-sm text-red-700 mb-4">
          This is usually a hiccup with our image service. Please try again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Cover */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">Cover</p>
        {images.coverImageUrl ? (
          <div className="mx-auto max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.coverImageUrl}
              alt="Coloring book cover"
              className="w-full rounded-xl border border-gray-200 bg-white"
            />
          </div>
        ) : (
          <Skeleton label={`Drawing ${childName}'s cover…`} />
        )}
      </div>

      {/* Page 1 */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">
          Page 1 of {totalPages}
        </p>
        <p className="text-center text-lg text-gray-800 mb-3 italic">&ldquo;{storyTexts.p1}&rdquo;</p>
        {images.page1ImageUrl ? (
          <div className="mx-auto max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.page1ImageUrl}
              alt="Page 1"
              className="w-full rounded-xl border border-gray-200 bg-white"
            />
          </div>
        ) : (
          <Skeleton label="Bringing the story to life…" />
        )}
      </div>

      {/* Page 2 */}
      <div className="card p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-center">
          Page 2 of {totalPages}
        </p>
        <p className="text-center text-lg text-gray-800 mb-3 italic">&ldquo;{storyTexts.p2}&rdquo;</p>
        {images.page2ImageUrl ? (
          <div className="mx-auto max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.page2ImageUrl}
              alt="Page 2"
              className="w-full rounded-xl border border-gray-200 bg-white"
            />
          </div>
        ) : (
          <Skeleton label="Almost there…" />
        )}
      </div>

      {/* Page 3 — locked cliffhanger (heavy lock, dark overlay) */}
      <div className="card p-6 mb-6 relative overflow-hidden border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
        <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold mb-2 text-center">
          Page 3 of {totalPages} · 🔒 Locked
        </p>
        <p className="text-center text-base font-extrabold text-orange-900 mb-3 uppercase tracking-wider">
          Continue the story…
        </p>
        <p className="text-center text-lg text-gray-800 mb-4 italic blur-md select-none">
          &ldquo;{storyTexts.p3}&rdquo;
        </p>
        <div className="mx-auto max-w-md relative">
          <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center border border-gray-900 shadow-2xl relative overflow-hidden">
            {/* dark vignette */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative text-center px-6">
              <div className="text-7xl mb-3 drop-shadow-[0_4px_12px_rgba(255,150,0,0.6)]">🔒</div>
              <p className="text-lg font-extrabold text-white mb-1 drop-shadow">
                {childName}&apos;s adventure is just beginning
              </p>
              <p className="text-sm text-orange-200">
                {totalPages - 2} more pages locked
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-orange-800 mt-4 font-bold">
          ↓ Unlock below to see how it ends ↓
        </p>
      </div>
    </>
  );
}
