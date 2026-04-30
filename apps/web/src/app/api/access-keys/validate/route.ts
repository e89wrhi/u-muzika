import { validateAccessKey } from '@/lib/access-keys';
import { deductCredits } from '@/lib/credits';
import { type CreditAction } from '@/lib/stripe';
import { NextResponse } from 'next/server';

// POST /api/access-keys/validate
// Public endpoint – used by external tools/scripts with a Bearer umk_... token
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const key = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!key) {
    return NextResponse.json(
      { valid: false, error: 'Missing Bearer token' },
      { status: 401 }
    );
  }

  const result = await validateAccessKey(key);

  if (!result.valid) {
    return NextResponse.json(
      { valid: false, error: result.reason },
      { status: 403 }
    );
  }

  // Optionally deduct credits for the action specified in the request body
  const body = (await req.json().catch(() => ({}))) as {
    action?: CreditAction;
  };
  if (body.action && result.clerkId) {
    const deduct = await deductCredits(result.clerkId, body.action, {
      via: 'access_key',
    });
    if (!deduct.success) {
      return NextResponse.json(
        {
          valid: true,
          authorized: false,
          error: 'Insufficient credits',
          remaining: deduct.remaining,
        },
        { status: 402 }
      );
    }
    return NextResponse.json({
      valid: true,
      authorized: true,
      remaining: deduct.remaining,
    });
  }

  return NextResponse.json({ valid: true, credits: result.credits });
}
