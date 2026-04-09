import type { Metadata } from 'next';
import BookCreator from '@/components/BookCreator';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Personalized AI Coloring Book for Kids — Make Your Child the Hero',
  description:
    'Create a personalized 20-page printable coloring storybook starring your child as the hero. Type their name, age and theme — get a beautiful PDF in minutes. From $5.90.',
  alternates: { canonical: '/' },
};

const benefits = [
  {
    icon: '🎨',
    t: 'Your child as the hero',
    d: "Their name appears on every page. They aren't coloring a stranger — they're coloring themselves on an adventure.",
  },
  {
    icon: '📖',
    t: '20-page printable PDF',
    d: 'A complete storybook with one full-page coloring image per page and a sentence of story. Print at home on letter or A4.',
  },
  {
    icon: '⏱',
    t: 'Ready in minutes',
    d: "We generate the cover and first 2 pages instantly so you know what you're getting before you pay.",
  },
];

const faqs = [
  {
    q: 'How does it work?',
    a: "Type your child's name, pick their age and a theme. We instantly generate the cover and the first 2 pages of their personalized story so you can preview. If you love it, unlock the full 20-page printable PDF for $5.90.",
  },
  {
    q: 'What ages is this for?',
    a: 'Designed for kids ages 3-10. Younger kids love seeing their name on the cover; older kids enjoy the story.',
  },
  {
    q: 'Is the PDF printable?',
    a: 'Yes — high-resolution letter-size PDF, ready to print at home or at any print shop. Each page is one full coloring image plus a line of story.',
  },
  {
    q: "What if I don't like the preview?",
    a: 'No charge. The 3-page preview is completely free. You only pay if you decide to unlock the full book.',
  },
  {
    q: 'Can I get a coloring page without a story?',
    a: (
      <>
        Yes — try our{' '}
        <a href="/free-tool" className="text-brand-700 underline">
          free single-image tool
        </a>
        . Type any prompt, get one printable coloring page, no signup, 5 free per day.
      </>
    ),
  },
];

export default function Home() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof f.a === 'string' ? f.a : 'See our website for details.',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero with form right inside */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-2 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Make a Personalized <span className="text-brand-600">Coloring Storybook</span> Starring Your Child
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          A printable 20-page adventure where your child is the hero. Their name on every page.
          Free preview · From $5.90.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">📖 20 pages</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🖨 Print at home</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🧒 Ages 3-10</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">⚡ Instant preview</span>
        </div>
      </section>

      <BookCreator />

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Why kids love it (and parents pay for it)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.t} className="card p-6 text-center">
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="font-semibold text-lg">{b.t}</h3>
              <p className="text-gray-600 mt-2">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12 bg-orange-50/50 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Tell us about your child', d: "Name, age, and pick a theme — princess, dinosaur, space, unicorn, or undersea." },
            { n: '2', t: 'See a free preview', d: 'We generate the cover and first 2 pages of the story instantly. Love it? Unlock the rest.' },
            { n: '3', t: 'Print and color', d: 'Pay $5.90, get the full 20-page PDF, print at home, hand it to your kid.' },
          ].map((s) => (
            <div key={s.n} className="card p-6 text-center bg-white">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-100 text-brand-700 font-bold text-xl flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="font-semibold text-lg">{s.t}</h3>
              <p className="text-gray-600 mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="card p-5 group">
              <summary className="cursor-pointer font-semibold text-gray-900 list-none flex justify-between items-center">
                <span>{f.q}</span>
                <span className="text-brand-600 group-open:rotate-45 transition">+</span>
              </summary>
              <div className="mt-3 text-gray-700">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
