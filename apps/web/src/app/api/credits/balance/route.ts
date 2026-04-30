import { auth } from '@clerk/nextjs/server';
import { getUserCredits } from '@/lib/credits';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

// GET /api/credits/balance – returns credits + recent transactions
export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const [credits, { data: transactions }] = await Promise.all([
    getUserCredits(userId),
    supabaseAdmin
      .from('credit_transactions')
      .select('id, amount, action, metadata, created_at')
      .eq('clerk_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  return NextResponse.json({ credits, transactions: transactions ?? [] });
}
