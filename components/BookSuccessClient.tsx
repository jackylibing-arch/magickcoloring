'use client';

import { useEffect, useState } from 'react';

type Status = {
  id: string;
  status: 'preview' | 'generating' | 'ready' | 'error';
  paid: boolean;
  childName: string;
  theme: string;
  progress: { filled: number; total: number };
  pdfReady: boolean;
  error?: string;
};

export default function BookSuccessClient({ bookId }: { bookId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  // On mount: kick off the build (idempotent — webhook may also have triggered it).
  useEffect(() => {
    let cancelled = false;

    async function startBuild() {
      try {
        const res = await fetch(`/api/book/${bookId}/build`, { method: 'POST' });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else if (!res.ok) {
          setBuildError(data.error || 'Build failed.');
        }
      } catch (err) {
        if (!cancelled) setBuildError('Network error during build.');
      }
    }

    startBuild();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  // Poll status every 3 seconds until ready or error.
  useEffect(() => {
    let cancelled = false;
    let timer: any;

    async function poll() {
      try {
        const res = await fetch(`/api/book/${bookId}/status`);
        const data = (await res.json()) as Status;
        if (cancelled) return;
        setStatus(data);
        if (data.status === 'ready' || data.status === 'error') {
          return;
        }
        timer = setTimeout(poll, 3000);
      } catch {
        if (!cancelled) timer = setTimeout(poll, 5000);
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [bookId]);

  const ready = status?.status === 'ready' && (pdfUrl || status?.pdfReady);
  const errorMessage = buildError || status?.error;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {!ready && !errorMessage && (
        <>
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Creating {status?.childName ?? 'your child'}'s coloring book…
          </h1>
          <p className="text-gray-600 mb-8">
            Hang tight — this takes about 60 seconds. Don't close this tab.
          </p>

          <div className="card p-6">
            <div className="flex justify-center mb-4">
              <div className="animate-spin h-12 w-12 border-4 border-brand-500 border-t-transparent rounded-full" />
            </div>
            {status?.progress && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-brand-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${(status.progress.filled / status.progress.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {status.progress.filled} of {status.progress.total} pages drawn
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {ready && (
        <>
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {status?.childName}'s coloring book is ready!
          </h1>
          <p className="text-gray-600 mb-8">
            Click below to download the PDF. Print it at home and hand it to your kid 🧡
          </p>
          <a
            href={pdfUrl ?? `/api/book/${bookId}/build`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            ⬇ Download {status?.childName}'s Coloring Book (PDF)
          </a>

          <div className="mt-12 card p-6 bg-amber-50 border-amber-200">
            <h2 className="text-xl font-bold mb-2">Want another one?</h2>
            <p className="text-gray-700 mb-4">
              Make a second personalized book with a different theme — perfect for siblings or as a gift.
            </p>
            <a href="/" className="btn-ghost">
              Make another book →
            </a>
          </div>
        </>
      )}

      {errorMessage && !ready && (
        <>
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-red-700 mb-6">{errorMessage}</p>
          <p className="text-sm text-gray-600 mb-4">
            Your payment was successful — we just had trouble building your book. Please contact us at hi@magickcoloring.com with your book ID:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">{bookId}</code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-ghost"
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
