import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { STRIPE_PLANS } from '@/lib/stripe';
import { KeysManager } from './components/KeysManager';
import { TransactionsList } from './components/TransactionsList';

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
          credits: 50,
          subscription_tier: 'free',
        })
        .select()
        .single();

      supabaseUser = newUser || supabaseUser;
    }
  }

  // Fetch access keys
  const { data: keys } = await supabaseAdmin
    .from('access_keys')
    .select('*')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false });

  // Fetch recent transactions
  const { data: transactions } = await supabaseAdmin
    .from('credit_transactions')
    .select('*')
    .eq('clerk_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="container max-w-4xl py-24 mx-auto px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-neutral-500">
          Manage your account preferences, billing, and API keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur text-left relative overflow-hidden">
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
              User record not found in Supabase. Please ensure your Clerk
              webhook is configured correctly.
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur text-left relative overflow-hidden">
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-4 relative z-10">
              Credits & Billing
            </h2>
            <div className="space-y-4">
              <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Available Credits
                </span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {supabaseUser?.credits ?? 0}
                </span>
              </div>

              <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Current Plan
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {supabaseUser?.subscription_tier ?? 'FREE'}
                </span>
              </div>

              <div className="pt-2">
                {!supabaseUser?.stripe_customer_id ||
                supabaseUser?.subscription_tier === 'free' ? (
                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="plan" value="PRO" />
                    <button
                      type="submit"
                      className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium text-sm transition-opacity hover:opacity-90"
                    >
                      Upgrade to Pro ({STRIPE_PLANS.PRO.credits} credits/mo)
                    </button>
                  </form>
                ) : (
                  <form action="/api/stripe/portal" method="POST">
                    <button
                      type="submit"
                      className="w-full py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-medium text-sm transition-opacity hover:bg-neutral-300 dark:hover:bg-neutral-700"
                    >
                      Manage Subscription
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Credit history list UI */}
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur text-left relative overflow-hidden">
            <TransactionsList transactions={transactions || []} />
          </div>
        </div>
      </div>

      {/* Access keys manager UI */}
      <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur text-left relative overflow-hidden">
        <KeysManager initialKeys={keys || []} />
      </div>
    </div>
  );
}
