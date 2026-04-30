import { stripe, STRIPE_PLANS, type StripePlanKey } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { addCredits } from '@/lib/credits';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export const maxDuration = 60;

const PLAN_BY_PRICE: Record<string, StripePlanKey> = Object.fromEntries(
  Object.entries(STRIPE_PLANS)
    .filter(([, v]) => v.priceId)
    .map(([k, v]) => [v.priceId as string, k as StripePlanKey])
);

async function getClerkIdFromCustomer(
  customerId: string
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('user')
    .select('clerk_id')
    .eq('stripe_customer_id', customerId)
    .single();
  return data?.clerk_id ?? null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      // ── New subscription created ────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const clerkId = session.metadata?.clerk_id;
        if (!clerkId) break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id ?? '';
        const planKey = PLAN_BY_PRICE[priceId] ?? 'FREE';
        const plan = STRIPE_PLANS[planKey];

        // Attach Stripe customer to user row
        await supabaseAdmin
          .from('user')
          .update({
            stripe_customer_id: customerId,
            subscription_tier: planKey.toLowerCase(),
            subscription_status: sub.status,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_id', clerkId);

        // Upsert subscription record
        await supabaseAdmin.from('subscriptions').upsert(
          {
            clerk_id: clerkId,
            stripe_subscription_id: sub.id,
            stripe_customer_id: customerId,
            stripe_price_id: priceId,
            status: sub.status,
            current_period_start: new Date(
              sub.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'stripe_subscription_id' }
        );

        // Credit the plan's monthly allowance
        await addCredits(clerkId, plan.credits, 'subscription_purchase', {
          plan: planKey,
          subscription_id: sub.id,
        });
        break;
      }

      // ── Renewal / update ────────────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== 'subscription_cycle') break;

        const customerId = invoice.customer as string;
        const clerkId = await getClerkIdFromCustomer(customerId);
        if (!clerkId) break;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptionId = (invoice as any).subscription as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id ?? '';
        const planKey = PLAN_BY_PRICE[priceId] ?? 'FREE';
        const plan = STRIPE_PLANS[planKey];

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_start: new Date(
              sub.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        // Top up credits for the new billing cycle
        await addCredits(clerkId, plan.credits, 'subscription_renewal', {
          plan: planKey,
          invoice_id: invoice.id,
        });
        break;
      }

      // ── Subscription cancelled / payment failed ─────────────────────────
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub: any = event.data.object;
        const customerId = sub.customer as string;
        const clerkId = await getClerkIdFromCustomer(customerId);
        if (!clerkId) break;

        const isActive = ['active', 'trialing'].includes(sub.status);
        await supabaseAdmin
          .from('user')
          .update({
            subscription_tier: isActive
              ? (
                  PLAN_BY_PRICE[sub.items.data[0]?.price.id ?? ''] ?? 'FREE'
                ).toLowerCase()
              : 'free',
            subscription_status: sub.status,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_id', clerkId);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
            canceled_at: sub.canceled_at
              ? new Date(sub.canceled_at * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
