import { auth } from '@clerk/nextjs/server';
import {
  generateAccessKey,
  listAccessKeys,
  revokeAccessKey,
} from '@/lib/access-keys';
import { NextResponse } from 'next/server';

// GET /api/access-keys – list all keys for current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const keys = await listAccessKeys(userId);
  return NextResponse.json({ keys });
}

// POST /api/access-keys – generate a new key
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as { label?: string; expiresInDays?: number };

  const result = await generateAccessKey(
    userId,
    body.label,
    body.expiresInDays
  );
  if (!result) {
    return NextResponse.json(
      { error: 'Failed to generate key' },
      { status: 500 }
    );
  }

  // Return the plain key only once
  return NextResponse.json({ id: result.id, key: result.key }, { status: 201 });
}

// DELETE /api/access-keys – revoke a key by id
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const { id } = (await req.json()) as { id: string };
  if (!id)
    return NextResponse.json({ error: 'Missing key id' }, { status: 400 });

  const ok = await revokeAccessKey(id, userId);
  if (!ok)
    return NextResponse.json({ error: 'Revoke failed' }, { status: 500 });

  return NextResponse.json({ success: true });
}
