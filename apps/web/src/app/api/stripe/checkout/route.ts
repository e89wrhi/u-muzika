import { auth } from '@clerk/nextjs/server';
import { stripe, STRIPE_PLANS, type StripePlanKey } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { plan } = (await req.json()) as { plan: StripePlanKey };

    const planConfig = STRIPE_PLANS[plan];
    if (!planConfig || !planConfig.priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Fetch user to get/create Stripe customer
    const { data: user } = await supabaseAdmin
      .from('user')
      .select('email, name, stripe_customer_id')
      .eq('clerk_id', userId)
      .single();

    if (!user) return new NextResponse('User not found', { status: 404 });

    let customerId = user.stripe_customer_id;

    // Create Stripe customer if not yet created
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { clerk_id: userId },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from('user')
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', userId);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      metadata: { clerk_id: userId, plan },
      success_url: `${baseUrl}/settings?checkout=success&plan=${plan}`,
      cancel_url: `${baseUrl}/settings?checkout=cancelled`,
      subscription_data: {
        metadata: { clerk_id: userId, plan },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe checkout error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
