import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS } from '@/lib/posts';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog — Coloring Page Tips, Guides & Inspiration',
  description: `Guides, tips and inspiration for parents, teachers, and adults who love coloring. From ${SITE.name}.`,
  alternates: { canonical: '/blog' },
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-3">Blog</h1>
      <p className="text-gray-600 mb-10">
        Practical guides and ideas for parents, teachers, and adult colorists.
      </p>

      <div className="grid gap-5">
        {POSTS.map((p) => (
          <Link
            href={`/blog/${p.slug}`}
            key={p.slug}
            className="card p-6 hover:border-brand-300 transition"
          >
            <p className="text-xs text-gray-500">{p.date}</p>
            <h2 className="text-xl font-bold mt-1">{p.title}</h2>
            <p className="text-gray-700 mt-2">{p.description}</p>
            <p className="text-brand-700 font-medium mt-3 text-sm">Read article →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
