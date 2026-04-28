import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  // Get user from Supabase
  let { data: supabaseUser } = await supabaseAdmin
    .from('user')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  // Local-Dev Fallback: sync automatically if webhook didn't hit local env
  if (!supabaseUser) {
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    if (clerkUser) {
      const { data: newUser } = await supabaseAdmin
        .from('user')
        .insert({
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          email_verified:
            clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          image: clerkUser.imageUrl,
          clerk_user: JSON.parse(JSON.stringify(clerkUser)),
          clerk_id: clerkUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      supabaseUser = newUser || supabaseUser;
    }
  }

  return (
    <div className="container max-w-4xl py-24 mx-auto px-6">
      <h1 className="text-3xl font-black mb-8 text-neutral-900 dark:text-white">
        Settings
      </h1>
      <p className="mb-8 text-neutral-500">
        Manage your account preferences and configurations here.
      </p>

      <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-neutral-100/50 dark:to-neutral-800/50 mix-blend-overlay pointer-events-none" />
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-4 relative z-10">
          Account Settings
        </h2>

        {supabaseUser ? (
          <div className="relative z-10 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Name
              </label>
              <div className="py-2 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100">
                {supabaseUser.name || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Email
              </label>
              <div className="py-2 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100">
                {supabaseUser.email || 'N/A'}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 p-4 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl text-sm border border-orange-200 dark:border-orange-900/50">
            User record not found in Supabase. Please ensure your Clerk webhook
            is configured correctly.
          </div>
        )}
      </div>
    </div>
  );
}
