import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = headers();
  const svixId = (await headerPayload).get('svix-id');
  const svixTimestamp = (await headerPayload).get('svix-timestamp');
  const svixSignature = (await headerPayload).get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing Svix headers', { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = event;

  try {
    if (type === 'user.created') {
      console.info('reached user created');

      const user = data;
      const { error } = await supabaseAdmin.from('user').insert({
        email: user.email_addresses?.[0]?.email_address || '',
        email_verified:
          user.email_addresses?.[0]?.verification?.status === 'verified',
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        image: user.image_url,
        foo: null,
        clerk_user: user,
        clerk_id: user.id,
        credits: 50,
        subscription_tier: 'free',
        subscription_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error(error.message);
      }
    }

    if (type === 'user.updated') {
      const user = data;
      const { error } = await supabaseAdmin
        .from('user')
        .update({
          email: user.email_addresses?.[0]?.email_address || '',
          email_verified:
            user.email_addresses?.[0]?.verification?.status === 'verified',
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          image: user.image_url,
          clerk_user: user,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_id', user.id);

      if (error) {
        console.error('Supabase Update Error:', error);
        throw new Error(error.message);
      }
    }

    if (type === 'user.deleted') {
      await supabaseAdmin.from('user').delete().eq('clerk_id', data.id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error handling Clerk webhook:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
