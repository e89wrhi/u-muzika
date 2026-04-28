import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete from Clerk
    await clerkClient.users.deleteUser(userId);

    // Supabase deletion handled by webhook (user.deleted)
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
