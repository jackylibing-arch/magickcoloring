import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.tagline} | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'ai coloring page generator',
    'free coloring pages',
    'printable coloring pages',
    'coloring page maker',
    'ai line art',
    'custom coloring book',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.tagline} | ${SITE.name}`,
    description: SITE.description,
    siteName: SITE.name,
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.tagline} | ${SITE.name}`,
    description: SITE.description,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE.name,
    url: SITE.url,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    description: SITE.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={SITE.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-orange-100 bg-white/80 backdrop-blur sticky top-0 z-30">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-display text-xl font-extrabold text-brand-700">
              ✨ {SITE.name}
            </a>
            <nav className="flex gap-5 text-sm font-medium text-gray-700">
              <a href="/" className="hover:text-brand-600">Create Book</a>
              <a href="/coloring-pages" className="hover:text-brand-600">Coloring Pages</a>
              <a href="/free-tool" className="hover:text-brand-600">Free Tool</a>
              <a href="/blog" className="hover:text-brand-600">Blog</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-orange-100 bg-white mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row md:justify-between gap-3">
            <div>© {new Date().getFullYear()} {SITE.name}. Built with ✨ for parents & teachers.</div>
            <div className="flex gap-4">
              <a href="/coloring-pages" className="hover:text-brand-600">Coloring Pages</a>
              <a href="/blog" className="hover:text-brand-600">Blog</a>
              <a href="/sitemap.xml" className="hover:text-brand-600">Sitemap</a>
            </div>
          </div>
        </footer>

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
