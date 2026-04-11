'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

const links = [
  { href: '/', label: 'Create Book' },
  { href: '/coloring-pages', label: 'Coloring Pages' },
  { href: '/free-tool', label: 'Free Tool' },
  { href: '/blog', label: 'Blog' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-orange-100 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-display text-xl font-extrabold text-brand-700">
          ✨ {SITE.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-5 text-sm font-medium text-gray-700">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-brand-600">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden border-t border-orange-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-brand-600 py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
