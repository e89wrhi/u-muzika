import { auth } from '@clerk/nextjs/server';
import { addCredits } from '@/lib/credits';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

const VALID_PROMOS: Record<string, number> = {
  'UMK-WELCOME': 20,
  'UMK-BETA-TESTER': 100,
  UNLOCK50: 50,
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { key } = (await req.json()) as { key?: string };

    if (!key) {
      return NextResponse.json(
        { error: 'Please enter a valid key.' },
        { status: 400 }
      );
    }

    const uppercaseKey = key.trim().toUpperCase();

    // In a real production app, this would check a `promo_codes` database table.
    // Here we use a hardcoded catalogue and verify they haven't used it via their transaction history.
    const creditAmount = VALID_PROMOS[uppercaseKey];

    if (!creditAmount) {
      return NextResponse.json(
        { error: 'Invalid or expired access key.' },
        { status: 400 }
      );
    }

    const actionName = `redeem_promo_${uppercaseKey}`;

    // Check if they already used this code
    const { data: existingTx } = await supabaseAdmin
      .from('credit_transactions')
      .select('id')
      .eq('clerk_id', userId)
      .eq('action', actionName)
      .single();

    if (existingTx) {
      return NextResponse.json(
        { error: 'You have already redeemed this code.' },
        { status: 400 }
      );
    }

    // Add credits securely
    const result = await addCredits(userId, creditAmount, actionName, {
      key: uppercaseKey,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to add credits to account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      added: creditAmount,
      newBalance: result.newBalance,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('Redeem API Error:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
