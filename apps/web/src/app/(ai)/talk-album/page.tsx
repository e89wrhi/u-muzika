import { redirect } from 'next/navigation';
import { AIChatClient } from '../components/ai-chat-client';
import { auth } from '@clerk/nextjs/server';

export default async function TalkAlbumPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedParams = await searchParams;
  const albumId = resolvedParams.id;

  if (!albumId) {
    redirect('/');
  }

  return <AIChatClient id={albumId} contextType="album" />;
}
