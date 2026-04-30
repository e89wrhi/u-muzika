// server-only – access key helpers
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomBytes } from 'crypto';

const KEY_PREFIX = 'umk_';

// ── Generate a new access key for a user ────────────────────────────────────
export async function generateAccessKey(
  clerkId: string,
  label?: string,
  expiresInDays?: number
): Promise<{ key: string; id: string } | null> {
  const rawKey = KEY_PREFIX + randomBytes(32).toString('hex');

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86_400_000).toISOString()
    : null;

  const { data, error } = await supabaseAdmin
    .from('access_keys')
    .insert({
      clerk_id: clerkId,
      key: rawKey,
      label: label ?? 'Default key',
      expires_at: expiresAt,
      is_active: true,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error('generateAccessKey error:', error);
    return null;
  }

  // Return the raw key ONCE – it is never stored plain again
  return { key: rawKey, id: data.id };
}

// ── Validate an access key (returns clerk_id + remaining credits if valid) ──
export async function validateAccessKey(key: string): Promise<{
  valid: boolean;
  clerkId?: string;
  credits?: number;
  reason?: string;
}> {
  const { data, error } = await supabaseAdmin
    .from('access_keys')
    .select('clerk_id, is_active, expires_at, user:clerk_id(credits)')
    .eq('key', key)
    .single();

  if (error || !data) return { valid: false, reason: 'Key not found' };
  if (!data.is_active) return { valid: false, reason: 'Key revoked' };
  if (data.expires_at && new Date(data.expires_at) < new Date())
    return { valid: false, reason: 'Key expired' };

  // Record last usage
  await supabaseAdmin
    .from('access_keys')
    .update({
      last_used_at: new Date().toISOString(),
      usage_count: supabaseAdmin.rpc('increment', { row_id: data.clerk_id }),
    })
    .eq('key', key);

  return {
    valid: true,
    clerkId: data.clerk_id,
    credits: (data.user as { credits?: number })?.credits ?? 0,
  };
}

// ── Revoke a key ─────────────────────────────────────────────────────────────
export async function revokeAccessKey(
  keyId: string,
  clerkId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('access_keys')
    .update({ is_active: false })
    .eq('id', keyId)
    .eq('clerk_id', clerkId); // ownership check

  return !error;
}

// ── List all keys for a user ──────────────────────────────────────────────
export async function listAccessKeys(clerkId: string) {
  const { data } = await supabaseAdmin
    .from('access_keys')
    .select(
      'id, label, is_active, expires_at, last_used_at, usage_count, created_at'
    )
    .eq('clerk_id', clerkId)
    .order('created_at', { ascending: false });

  return data ?? [];
}
