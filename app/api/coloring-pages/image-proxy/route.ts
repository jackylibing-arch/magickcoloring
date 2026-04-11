// GET /api/coloring-pages/image-proxy?url=<fal-url>&filename=<name>
// Proxies a fal.ai CDN image so the browser can download it as a file.
// The `download` attribute on <a> only triggers for same-origin URLs.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTNAME = /^(v\d+\.)?fal\.media$/;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'coloring-page.png';

  if (!url) {
    return NextResponse.json({ error: 'url required' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  // Only proxy fal.media to prevent open-redirect / SSRF abuse.
  if (!ALLOWED_HOSTNAME.test(parsed.hostname)) {
    return NextResponse.json({ error: 'disallowed host' }, { status: 403 });
  }

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'upstream error' }, { status: 502 });
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
