export const SITE = {
  name: 'Magick Coloring',
  domain: 'magickcoloring.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://magickcoloring.com',
  tagline: 'Free AI Coloring Page Generator',
  description:
    'Turn any idea into a printable coloring page in seconds. Free AI coloring page generator — no signup, instant download, kid-safe line art.',
  twitter: '@magickcoloring',
  freeDailyLimit: 3,
} as const;

export const STYLES = [
  { id: 'simple', label: 'Simple (Kids)', hint: 'thick lines, large shapes, very simple, ages 3-6' },
  { id: 'medium', label: 'Medium (Ages 7-12)', hint: 'medium detail, clean line art, ages 7-12' },
  { id: 'detailed', label: 'Detailed (Adults)', hint: 'intricate detail, mandala-style, fine line art, adult coloring' },
  { id: 'cute', label: 'Cute / Kawaii', hint: 'cute kawaii style, big eyes, chibi, simple line art' },
] as const;

export type StyleId = (typeof STYLES)[number]['id'];
