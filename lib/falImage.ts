// fal.ai image generation wrapper — used by both /api/generate (single image)
// and the book product (cover + per-page generation).

const FAL_ENDPOINT = 'https://fal.run/fal-ai/flux/schnell';

export async function generateColoringImage(fullPrompt: string): Promise<string> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    throw new Error('FAL_KEY missing');
  }

  const res = await fetch(FAL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: fullPrompt,
      image_size: 'square_hd',
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`fal.ai ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = (await res.json()) as { images?: { url: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) throw new Error('fal.ai returned no image');
  return url;
}

// Build the full coloring-book-style prompt from a scene fragment.
// Optimised for kids' coloring books: thick outlines, no shading.
export function buildBookPagePrompt(scene: string): string {
  return [
    `Coloring book page of ${scene.trim()}.`,
    'Pure black and white line art only. No shading, no grayscale, no color.',
    'Thick bold outlines, very simple shapes, large areas to color.',
    'White background. Crisp clean black outlines. High contrast.',
    'Centered composition, full subject visible.',
    "Children's coloring book style, suitable for ages 3-8.",
    'No text, no watermark, no signature.',
  ].join(' ');
}
