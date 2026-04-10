'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { STYLES, type StyleId, SITE } from '@/lib/site';

type GenState = 'idle' | 'loading' | 'done' | 'error';

export default function Generator() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');

  // Pre-fill from ?prompt=... when arriving from /coloring-pages/[slug] CTA.
  useEffect(() => {
    const seed = searchParams.get('prompt');
    if (seed && !prompt) setPrompt(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [style, setStyle] = useState<StyleId>('simple');
  const [state, setState] = useState<GenState>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setState('loading');
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setError(data.error || 'Generation failed');
        if (typeof data.remaining === 'number') setRemaining(data.remaining);
        return;
      }
      setImageUrl(data.imageUrl);
      setRemaining(data.remaining ?? null);
      setState('done');
    } catch (err) {
      setState('error');
      setError('Network error. Please try again.');
    }
  }

  const examples = [
    'a friendly dinosaur eating ice cream',
    'unicorn in a magical forest',
    'cute puppy playing with a ball',
    'underwater castle with mermaids',
    'space rocket flying past planets',
    'a dragon with butterfly wings',
    'a cat sitting in a teacup',
    'a fire truck with a dalmatian',
    'an owl with detailed patterned feathers',
    'a robot watering flowers',
    'a turtle wearing a wizard hat',
    'a panda eating bamboo on a cloud',
  ];

  function surpriseMe() {
    const next = examples[Math.floor(Math.random() * examples.length)];
    setPrompt(next);
  }

  return (
    <section id="generator" className="mx-auto max-w-6xl px-4 py-10">
      <div className="card p-6 md:p-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-800">
                Describe your coloring page
              </label>
              <button
                type="button"
                onClick={surpriseMe}
                className="text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                🎲 Surprise me
              </button>
            </div>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a friendly dragon reading a book"
              maxLength={200}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  type="button"
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-xs rounded-full bg-orange-100 px-3 py-1 text-brand-700 hover:bg-orange-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    style === s.id
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-brand-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button type="submit" className="btn-primary" disabled={state === 'loading' || !prompt.trim()}>
              {state === 'loading' ? 'Generating…' : '✨ Generate Coloring Page'}
            </button>
            <p className="text-xs text-gray-500">
              {remaining !== null
                ? `${remaining} free generations left today`
                : `Free: ${SITE.freeDailyLimit} generations / day · No signup`}
            </p>
          </div>
        </form>

        <div className="mt-8">
          {state === 'loading' && (
            <div className="aspect-square w-full max-w-md mx-auto rounded-xl bg-orange-50 border border-dashed border-orange-200 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full mx-auto" />
                <p className="mt-3 text-sm text-gray-600">Drawing your coloring page…</p>
                <p className="text-xs text-gray-400">~10 seconds</p>
              </div>
            </div>
          )}

          {state === 'error' && error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {state === 'done' && imageUrl && (
            <div className="space-y-4">
              <div className="mx-auto max-w-md print-area">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`AI generated coloring page: ${prompt}`}
                  className="w-full rounded-xl border border-gray-200 bg-white"
                />
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href={imageUrl} download={`coloring-${Date.now()}.png`} className="btn-primary">
                  ⬇ Download PNG
                </a>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => window.print()}
                >
                  🖨 Print
                </button>
              </div>
              <p className="text-center text-xs text-gray-500">
                Free for personal & classroom use. Want unlimited HD downloads & no watermark?{' '}
                <span className="text-brand-700 font-medium">Pro coming soon.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
