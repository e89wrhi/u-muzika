import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { redirect } from 'next/navigation';

export default async function MePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const clerkUser = await currentUser();

  let { data: supabaseUser } = await supabaseAdmin
    .from('user')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  // Local-Dev Fallback: If webhook didn't hit localhost, forcefully sync them now
  if (!supabaseUser && clerkUser) {
    const { data: newUser, error } = await supabaseAdmin
      .from('user')
      .insert({
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        email_verified:
          clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        image: clerkUser.imageUrl,
        clerk_user: JSON.parse(JSON.stringify(clerkUser)), // serialize safe
        clerk_id: clerkUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error) {
      supabaseUser = newUser;
    }
  }

  return (
    <div className="container max-w-4xl py-24 mx-auto px-6">
      <h1 className="text-3xl font-black mb-8 text-neutral-900 dark:text-white">
        My Profile
      </h1>
      <p className="mb-8 text-neutral-500">
        This page verifies the sync between Clerk and Supabase for your
        authenticated user state.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">
            Clerk Auth Data
          </h2>
          <pre className="text-xs overflow-auto p-4 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-100 dark:bg-neutral-950/80 rounded-xl whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-mono">
            {JSON.stringify(
              {
                id: clerkUser?.id,
                name: clerkUser?.fullName,
                email: clerkUser?.emailAddresses[0]?.emailAddress,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">
            Supabase Sync Data
          </h2>
          {supabaseUser ? (
            <pre className="text-xs overflow-auto p-4 border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-100 dark:bg-neutral-950/80 rounded-xl whitespace-pre-wrap text-green-600 dark:text-green-400 font-mono">
              {JSON.stringify(supabaseUser, null, 2)}
            </pre>
          ) : (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl text-sm border border-orange-200 dark:border-orange-900/50">
              User record not found in Supabase. Webhook may be pending or
              failed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
