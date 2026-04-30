// server-only – credits helpers
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CREDIT_COSTS, type CreditAction } from '@/lib/stripe';

// ── Read balance ────────────────────────────────────────────────────────────
export async function getUserCredits(clerkId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('user')
    .select('credits')
    .eq('clerk_id', clerkId)
    .single();
  return data?.credits ?? 0;
}

// ── Deduct credits for an AI action (returns false if insufficient) ─────────
export async function deductCredits(
  clerkId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; remaining: number; error?: string }> {
  const cost = CREDIT_COSTS[action];

  // Atomic check-and-deduct via RPC to avoid race conditions
  const { data, error } = await supabaseAdmin.rpc('deduct_credits', {
    p_clerk_id: clerkId,
    p_amount: cost,
  });

  if (error || !data?.success) {
    return {
      success: false,
      remaining: data?.remaining ?? 0,
      error: error?.message ?? 'Insufficient credits',
    };
  }

  // Record the transaction
  await supabaseAdmin.from('credit_transactions').insert({
    clerk_id: clerkId,
    amount: -cost,
    action,
    metadata: metadata ?? {},
    created_at: new Date().toISOString(),
  });

  return { success: true, remaining: data.remaining };
}

// ── Add credits (called from Stripe webhook / admin) ────────────────────────
export async function addCredits(
  clerkId: string,
  amount: number,
  action: string = 'purchase',
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; newBalance: number }> {
  const { data, error } = await supabaseAdmin.rpc('add_credits', {
    p_clerk_id: clerkId,
    p_amount: amount,
  });

  if (error) {
    console.error('addCredits error:', error);
    return { success: false, newBalance: 0 };
  }

  await supabaseAdmin.from('credit_transactions').insert({
    clerk_id: clerkId,
    amount,
    action,
    metadata: metadata ?? {},
    created_at: new Date().toISOString(),
  });

  return { success: true, newBalance: data?.new_balance ?? 0 };
}
