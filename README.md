# Magick Coloring

Free AI Coloring Page Generator — site #1 of the AI web出海 factory.

- **Domain:** magickcoloring.com
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · SiliconFlow (FLUX.1-schnell)
- **Deploy:** Vercel · DNS Cloudflare
- **Monetization plan:** Adsense → Affiliate → Stripe Pro ($5/mo) → API

## Local development

```bash
npm install
cp .env.example .env.local
# add your SILICONFLOW_KEY
npm run dev
```

Open http://localhost:3000

## Environment variables

| Var | Required | Notes |
|---|---|---|
| `SILICONFLOW_KEY` | yes | Get from https://cloud.siliconflow.cn/account/ak |
| `NEXT_PUBLIC_SITE_URL` | yes | https://magickcoloring.com |
| `NEXT_PUBLIC_GA_ID` | no | Google Analytics, e.g. `G-XXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | no | Adsense client `ca-pub-XXXX` |

## File map

```
app/
  layout.tsx              Root layout, header, footer, GA, Adsense, JSON-LD
  page.tsx                Landing + Generator + How it works + FAQ
  api/generate/route.ts   POST → SiliconFlow FLUX.1-schnell, with rate limit
  blog/page.tsx           Blog index
  blog/[slug]/page.tsx    Blog post page
  sitemap.ts              /sitemap.xml
  robots.ts               /robots.txt
components/
  Generator.tsx           Client-side generator UI
lib/
  site.ts                 Site constants + style presets
  prompt.ts               Prompt builder + safety filter
  rateLimit.ts            Cookie + IP daily limit
  posts.ts                5 SEO blog articles (hand-written)
  markdown.tsx            Tiny markdown renderer (no deps)
```

## Deployment guide

See `DEPLOY.md` for the full step-by-step (GitHub → Vercel → Cloudflare DNS → Google Search Console → SiliconFlow key).

## Costs

| Item | Cost |
|---|---|
| Domain (year 1) | $10.46 |
| Vercel hosting | $0 (Hobby) |
| Cloudflare DNS | $0 |
| SiliconFlow FLUX.1-schnell | **Free tier** |
| Stripe (later) | 2.9% + $0.30 |

FLUX.1-schnell is free on SiliconFlow's free tier (with rate limits). When traffic exceeds the free tier, paid usage is ~¥0.0035/image. Adsense at 100 DUV ≈ $30-60/month. Break-even = essentially day 1.
