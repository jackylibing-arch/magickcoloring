// POST /api/checkout
// Body: { bookId }
// Creates a Stripe Checkout session for the one-time book purchase.

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICES } from '@/lib/stripe';
import { getBook } from '@/lib/bookStore';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { bookId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const bookId = body.bookId;
  if (!bookId) {
    return NextResponse.json({ error: 'bookId required.' }, { status: 400 });
  }

  const book = await getBook(bookId);
  if (!book) {
    return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
  }
  if (book.paid) {
    return NextResponse.json({ error: 'Book already paid.' }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const origin = req.headers.get('origin') || SITE.url;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: PRICES.oneTime.currency,
            unit_amount: PRICES.oneTime.amount,
            product_data: {
              name: `${book.childName}'s Personalized Coloring Book`,
              description: `${book.story.length}-page printable PDF — ${book.theme} theme`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookId: book.id,
      },
      success_url: `${origin}/book/${book.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${book.id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('stripe checkout error', err);
    return NextResponse.json(
      { error: `Checkout failed: ${err.message || 'unknown'}` },
      { status: 502 }
    );
  }
}
