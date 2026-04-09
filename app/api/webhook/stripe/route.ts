// Stripe webhook receiver.
// Listens for `checkout.session.completed` and marks the book as paid.
// Build/PDF generation is triggered separately (by /api/book/[id]/build,
// which the client also calls on the success page).

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getBook, updateBook } from '@/lib/bookStore';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret.' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error('webhook signature verification failed', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookId = session.metadata?.bookId;
    if (!bookId) {
      console.warn('checkout.session.completed with no bookId metadata', session.id);
      return NextResponse.json({ received: true });
    }
    const book = await getBook(bookId);
    if (!book) {
      console.warn('checkout for unknown book', bookId);
      return NextResponse.json({ received: true });
    }
    if (!book.paid) {
      await updateBook(bookId, { paid: true, status: 'generating' });
    }
    // Fire-and-forget: kick off build. We don't await this so the webhook returns fast.
    // The client also calls /build on the success page, so it's idempotent.
    const origin = SITE.url;
    fetch(`${origin}/api/book/${bookId}/build`, { method: 'POST' }).catch((e) =>
      console.error('failed to kick off build from webhook', e)
    );
  }

  return NextResponse.json({ received: true });
}
