import type { Metadata } from 'next';
import Generator from '@/components/Generator';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Free AI Coloring Page Generator — Single Image',
  description:
    'Free single-image AI coloring page generator. Type any idea, get a printable line drawing in seconds. No signup required.',
  alternates: { canonical: '/free-tool' },
};

const faqs = [
  {
    q: 'Is this single-image tool really free?',
    a: `Yes. ${SITE.freeDailyLimit} free coloring pages per day, no signup. Want a personalized 20-page storybook? Try our Personalized Coloring Book on the home page.`,
  },
  {
    q: 'Can I print the coloring pages?',
    a: 'Yes — every image is high-contrast black-and-white line art optimized for printing on letter or A4 paper.',
  },
  {
    q: 'How is this different from the personalized book?',
    a: "This tool gives you ONE coloring page from any prompt — great for quick fixes. The personalized book on our home page generates a 20-page printable PDF starring your child as the hero, with a story.",
  },
];

export default function FreeTool() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Free <span className="text-brand-600">Single-Image</span> Coloring Page Generator
        </h1>
        <p className="mt-5 text-lg text-gray-700 max-w-2xl mx-auto">
          Type any idea. Get a printable coloring page in seconds. No signup.{' '}
          <strong>{SITE.freeDailyLimit} free pages every day.</strong>
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block text-sm text-brand-700 underline hover:text-brand-800"
          >
            ← Looking for a 20-page personalized storybook? Try our Coloring Book →
          </a>
        </div>
      </section>

      <Generator />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="card p-5 group">
              <summary className="cursor-pointer font-semibold text-gray-900 list-none flex justify-between items-center">
                <span>{f.q}</span>
                <span className="text-brand-600 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
