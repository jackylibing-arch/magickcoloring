import { NextRequest, NextResponse } from 'next/server';
import { buildColoringPrompt, isPromptSafe } from '@/lib/prompt';
import { SITE, type StyleId } from '@/lib/site';
import { checkAndBump, getIp, writeCookieUsage } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// fal.ai sync REST endpoint — no SDK needed.
const FAL_ENDPOINT = 'https://fal.run/fal-ai/flux/schnell';

type FalResponse = {
  images?: { url: string; width?: number; height?: number }[];
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server is not configured (missing FAL_KEY).' },
      { status: 500 }
    );
  }

  let body: { prompt?: string; style?: StyleId };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const prompt = (body.prompt || '').trim();
  const style: StyleId = (body.style as StyleId) || 'simple';

  if (prompt.length < 2 || prompt.length > 200) {
    return NextResponse.json({ error: 'Prompt must be 2-200 characters.' }, { status: 400 });
  }
  if (!isPromptSafe(prompt)) {
    return NextResponse.json(
      { error: 'This prompt is not allowed. Please try a kid-friendly subject.' },
      { status: 400 }
    );
  }

  // Rate limit: KV-backed, atomic per-IP per-day.
  // This is the single source of truth — cookies are UX-only.
  const ip = getIp(req);
  const { allowed, count, remaining } = await checkAndBump('gen', ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Daily free limit reached (${SITE.freeDailyLimit}/day). Come back tomorrow, or try our Personalized Coloring Book.`,
        remaining: 0,
      },
      { status: 429 }
    );
  }

  const fullPrompt = buildColoringPrompt(prompt, style);

  try {
    const falRes = await fetch(FAL_ENDPOINT, {
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

    if (!falRes.ok) {
      const txt = await falRes.text();
      console.error('fal.ai error', falRes.status, txt);
      return NextResponse.json(
        { error: `AI generation failed (${falRes.status}). ${txt.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = (await falRes.json()) as FalResponse;
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Generation returned no image.' }, { status: 502 });
    }

    // Cookie is UI-only; KV already incremented in checkAndBump above.
    writeCookieUsage(count);

    return NextResponse.json({
      imageUrl,
      remaining,
    });
  } catch (err) {
    console.error('fal.ai request failed', err);
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 502 }
    );
  }
}
