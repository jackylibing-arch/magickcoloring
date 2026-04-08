import type { StyleId } from './site';

const STYLE_PROMPTS: Record<StyleId, string> = {
  simple: 'thick bold outlines, very simple shapes, large areas to color, minimal detail, for toddlers ages 3-6',
  medium: 'clean medium-detail line art, balanced shapes, ages 7-12',
  detailed: 'highly detailed intricate line art, mandala-like patterns, fine lines, adult coloring book style',
  cute: 'cute kawaii chibi style, big round eyes, simple bold outlines, adorable',
};

export function buildColoringPrompt(userPrompt: string, style: StyleId): string {
  const base = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.simple;
  return [
    `Coloring book page of ${userPrompt.trim()}.`,
    'Pure black and white line art only. No shading. No grayscale. No color.',
    'White background. Crisp clean black outlines. High contrast.',
    'Centered composition, full subject visible.',
    base,
    'Suitable for printing on letter paper. No text, no watermark, no signature.',
  ].join(' ');
}

// Rough banned-prompt filter — keep it simple, fal also has built-in safety.
const BANNED = [
  'nude', 'naked', 'nsfw', 'sex', 'porn', 'gore', 'blood', 'kill',
  'weapon', 'gun', 'rifle', 'pistol', 'knife',
];

export function isPromptSafe(prompt: string): boolean {
  const p = prompt.toLowerCase();
  return !BANNED.some((w) => p.includes(w));
}
