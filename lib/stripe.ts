import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  _stripe = new Stripe(key, { apiVersion: '2025-03-31.basil' as any });
  return _stripe;
}

export const PRICES = {
  oneTime: {
    amount: 590, // $5.90
    currency: 'usd',
    label: 'Personalized Coloring Book (PDF)',
  },
  upsellExtra: {
    amount: 390, // $3.90
    currency: 'usd',
    label: 'Add another book',
  },
};
