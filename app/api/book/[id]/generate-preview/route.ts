// POST /api/book/[id]/generate-preview
// Manual retry endpoint. The normal flow runs preview generation via
// waitUntil() inside /api/book/create — this endpoint exists so the client
// can re-trigger generation if it sees a stuck/errored state.

import { NextRequest, NextResponse } from 'next/server';
import { generatePreviewForBook } from '@/lib/bookPreviewGen';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await generatePreviewForBook(params.id);
    return NextResponse.json({ status: 'preview-ready' });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Preview generation failed: ${err?.message || 'unknown'}` },
      { status: 502 }
    );
  }
}
