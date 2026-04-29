import { redirect } from 'next/navigation';
import { AIChatClient } from '../components/ai-chat-client';
import { auth } from '@clerk/nextjs/server';

export default async function TalkVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedParams = await searchParams;
  const videoId = resolvedParams.id;

  if (!videoId) {
    redirect('/');
  }

  return <AIChatClient id={videoId} contextType="video" />;
}
