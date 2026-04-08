import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { POSTS, getPostBySlug } from '@/lib/posts';
import { Markdown } from '@/lib/markdown';
import { SITE } from '@/lib/site';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default function BlogPost({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link href="/blog" className="text-brand-700 text-sm hover:underline">← All articles</Link>
      <h1 className="text-4xl font-extrabold mt-3 mb-2 leading-tight">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{post.date}</p>
      <Markdown source={post.body} />

      <div className="mt-12 card p-6 text-center">
        <h3 className="text-xl font-bold">Try the free generator</h3>
        <p className="text-gray-600 mt-2">
          {SITE.freeDailyLimit} free coloring pages every day. No signup.
        </p>
        <Link href="/" className="btn-primary mt-4">✨ Open the generator</Link>
      </div>
    </article>
  );
}
