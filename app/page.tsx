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

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Mom of 2',
    stars: 5,
    text: "My daughter literally screamed when she saw her name on the cover. She's been coloring it every day this week — totally worth it.",
  },
  {
    name: 'Jessica R.',
    role: 'Mom of Liam, 6',
    stars: 5,
    text: "I've bought a lot of activity books, but this is the first one my son actually finished. Seeing himself as the dinosaur hero made all the difference.",
  },
  {
    name: 'Emily T.',
    role: 'Kindergarten teacher',
    stars: 5,
    text: "I made one for each of my students for the holidays. Best $5.90 I've ever spent on classroom prep — they were obsessed.",
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
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-800 mb-4">
          ⚡ Personalized in 10 seconds · Loved by 10,000+ families
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Turn Your Child Into a <span className="text-brand-600">Storybook Hero</span> in 10 Seconds
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          We create a personalized coloring book with your child's name —
          a 20-page printable adventure where they are the hero. From <strong>$5.90</strong>.
        </p>

        {/* Social proof row */}
        <div className="mt-5 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg tracking-tight">★★★★★</span>
            <span className="text-sm font-semibold text-gray-800">4.9</span>
            <span className="text-sm text-gray-500">· 10,000+ books created</span>
          </div>
          <p className="text-xs text-gray-500">
            "My daughter literally screamed when she saw her name on the cover." — Sarah M.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">📖 20 pages</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🖨 Print at home</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">🧒 Ages 3-10</span>
          <span className="rounded-full bg-white border border-orange-200 px-3 py-1">⚡ Instant preview</span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>🔒 Secure Stripe checkout</span>
          <span>💳 No subscription</span>
          <span>↩️ 100% free preview</span>
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

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-yellow-400 text-xl tracking-tight">★★★★★</span>
            <span className="text-base font-bold text-gray-900">4.9 / 5</span>
          </div>
          <h2 className="text-3xl font-bold">Loved by 10,000+ families</h2>
          <p className="text-gray-600 mt-2">Real stories from real parents.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="text-yellow-400 text-sm tracking-tight mb-2">
                {'★'.repeat(t.stars)}
              </div>
              <p className="text-gray-800 italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-gray-500">{t.role}</div>
              </div>
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
