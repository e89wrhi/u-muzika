// server-only – never import on client
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// ── Plan / Price catalogue ──────────────────────────────────────────────────
export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    credits: 50, // initial free credits
    priceId: null, // no Stripe price for free tier
  },
  PRO: {
    name: 'Pro',
    credits: 500,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
  },
  ULTRA: {
    name: 'Ultra',
    credits: 2000,
    priceId: process.env.STRIPE_ULTRA_PRICE_ID ?? '',
  },
} as const;

export type StripePlanKey = keyof typeof STRIPE_PLANS;

// ── Credit cost per AI action ───────────────────────────────────────────────
export const CREDIT_COSTS = {
  chat_message: 1,
  image_convert: 5,
  video_summary: 10,
  album_analysis: 8,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;
