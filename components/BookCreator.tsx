'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES, AGE_OPTIONS, type Theme } from '@/lib/templates';

export default function BookCreator() {
  const router = useRouter();
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState<number>(5);
  const [theme, setTheme] = useState<Theme>('princess');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!childName.trim()) {
      setError("Please enter your child's name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/book/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: childName.trim(), age, theme }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create book.');
        setLoading(false);
        return;
      }
      router.push(`/book/${data.id}`);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <section id="creator" className="mx-auto max-w-3xl px-4 py-8">
      <div className="card p-6 md:p-8">
        <p className="text-center text-sm text-gray-500 mb-4">
          👇 Try: <button
            type="button"
            onClick={() => { setChildName('Emma'); setAge(5); setTheme('princess'); }}
            className="font-semibold text-brand-700 hover:text-brand-800 underline-offset-2 hover:underline"
          >
            Emma, age 5, princess theme
          </button>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Child's name
            </label>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Lily"
              maxLength={30}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Age</label>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a} years old
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !childName.trim()}
            className="btn-primary w-full text-lg py-4"
          >
            {loading ? 'Creating your preview… (~15 seconds)' : '✨ Create Free Preview'}
          </button>
          <p className="text-center text-xs text-gray-500">
            Free 3-page preview · No signup · Unlock the full 20-page book for $5.90
          </p>
        </form>
      </div>
    </section>
  );
}
