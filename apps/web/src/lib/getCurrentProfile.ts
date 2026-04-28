// lib/getCurrentProfile.ts
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getCurrentProfile() {
  const user = await currentUser(); // server-side Clerk user
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from('user')
    .select('id, name, image, email, clerk_id')
    .eq('clerk_id', user.id)
    .single();

  return { user, profile };
}
