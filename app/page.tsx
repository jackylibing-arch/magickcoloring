import type { Metadata } from 'next';
import Generator from '@/components/Generator';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.tagline} — Free, Instant, Printable`,
  description: SITE.description,
};

const faqs = [
  {
    q: 'Is the AI coloring page generator really free?',
    a: `Yes. You get ${SITE.freeDailyLimit} free coloring pages every day, no signup required. Pages are free for personal, family, and classroom use.`,
  },
  {
    q: 'Can I print the coloring pages?',
    a: 'Absolutely. Every page is generated as a high-contrast black-and-white line drawing optimized for printing on standard letter or A4 paper.',
  },
  {
    q: 'Are the pages safe for kids?',
    a: 'Yes. We filter prompts and the AI is tuned to produce clean, kid-friendly line art. We recommend adult supervision for very young children when entering prompts.',
  },
  {
    q: 'Can I use the coloring pages in my classroom or daycare?',
    a: 'Yes — teachers love us. Classroom and homeschool use is fully allowed. If you need bulk generation for a school, Pro is coming soon.',
  },
  {
    q: 'What ages are these coloring pages for?',
    a: 'Pick a style: Simple for ages 3-6, Medium for ages 7-12, Detailed for teens & adults, or Cute/Kawaii for any age.',
  },
];

export default function Home() {
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Free <span className="text-brand-600">AI Coloring Page</span> Generator
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Type any idea. Get a printable coloring page in seconds. Loved by parents, teachers,
          and kids. <strong>No signup. {SITE.freeDailyLimit} free pages every day.</strong>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">⚡ ~10 second generation</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🖨 Print-ready</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🧒 Kid-safe</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">💯 100% free</span>
        </div>
      </section>

      <Generator />

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Describe', d: 'Type any subject — animals, princesses, dinosaurs, mandalas, anything.' },
            { n: '2', t: 'Pick a style', d: 'Choose simple lines for toddlers or detailed art for adults.' },
            { n: '3', t: 'Print & color', d: 'Download your free PNG and print it. Or color directly on screen.' },
          ].map((s) => (
            <div key={s.n} className="card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-100 text-brand-700 font-bold text-xl flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="font-semibold text-lg">{s.t}</h3>
              <p className="text-gray-600 mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-10">Why parents & teachers love {SITE.name}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Truly unlimited variety', d: 'Stop scrolling Pinterest. Type any idea your child has and get a brand-new coloring page in seconds.' },
            { t: 'Clean line art', d: 'Optimized prompts produce crisp, high-contrast black & white outlines — perfect for crayons, markers and pencils.' },
            { t: 'No signup, no spam', d: 'No account needed. No email collected. Just type and download.' },
          ].map((b) => (
            <div key={b.t} className="card p-6">
              <h3 className="font-semibold text-lg">{b.t}</h3>
              <p className="text-gray-600 mt-2">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
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
