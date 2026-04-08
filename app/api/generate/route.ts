import { NextRequest, NextResponse } from 'next/server';
import { buildColoringPrompt, isPromptSafe } from '@/lib/prompt';
import { SITE, type StyleId } from '@/lib/site';
import {
  bumpIpUsage,
  getIpUsage,
  readCookieUsage,
  remainingFromCount,
  writeCookieUsage,
} from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SiliconFlow image generation endpoint (OpenAI-compatible)
const SF_ENDPOINT = 'https://api.siliconflow.cn/v1/images/generations';
const SF_MODEL = 'black-forest-labs/FLUX.1-schnell'; // free tier on SiliconFlow

type SfResponse = {
  images?: { url: string }[];
  data?: { url: string }[];
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.SILICONFLOW_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server is not configured (missing SILICONFLOW_KEY).' },
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

  // Rate limit (cookie + IP)
  const cookieCount = readCookieUsage();
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const ipCount = getIpUsage(ip);
  const used = Math.max(cookieCount, ipCount);

  if (used >= SITE.freeDailyLimit) {
    return NextResponse.json(
      {
        error: `Daily free limit reached (${SITE.freeDailyLimit}/day). Come back tomorrow or upgrade to Pro (coming soon).`,
        remaining: 0,
      },
      { status: 429 }
    );
  }

  const fullPrompt = buildColoringPrompt(prompt, style);

  try {
    // FLUX.1-schnell on SiliconFlow uses a fixed step count (4) — do NOT send num_inference_steps.
    const sfRes = await fetch(SF_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: SF_MODEL,
        prompt: fullPrompt,
        image_size: '1024x1024',
        batch_size: 1,
      }),
    });

    if (!sfRes.ok) {
      const txt = await sfRes.text();
      console.error('SiliconFlow error', sfRes.status, txt);
      // Surface upstream error for debugging — safe to show, contains no secrets.
      return NextResponse.json(
        {
          error: `AI generation failed (${sfRes.status}). ${txt.slice(0, 300)}`,
        },
        { status: 502 }
      );
    }

    const data = (await sfRes.json()) as SfResponse;
    const imageUrl = data.images?.[0]?.url || data.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'Generation returned no image.' }, { status: 502 });
    }

    const newCount = used + 1;
    writeCookieUsage(newCount);
    bumpIpUsage(ip);

    return NextResponse.json({
      imageUrl,
      remaining: remainingFromCount(newCount),
    });
  } catch (err) {
    console.error('SiliconFlow request failed', err);
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 502 }
    );
  }
}
