import { auth } from '@clerk/nextjs/server';
import { deductCredits } from '@/lib/credits';
import { CREDIT_COSTS, type CreditAction } from '@/lib/stripe';
import { NextResponse } from 'next/server';

// POST /api/credits/use – deduct credits for an AI action
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as {
    action: CreditAction;
    metadata?: Record<string, unknown>;
  };
  const { action, metadata } = body;

  if (!action || !(action in CREDIT_COSTS)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const result = await deductCredits(userId, action, metadata);

  if (!result.success) {
    return NextResponse.json(
      {
        error: result.error ?? 'Insufficient credits',
        remaining: result.remaining,
      },
      { status: 402 } // Payment Required
    );
  }

  return NextResponse.json({ success: true, remaining: result.remaining });
}
